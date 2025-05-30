import $ from "jquery";

declare global {
    interface Window {
        CrazyGames: any;
        PokiSDK: any;
        SDK_OPTIONS: any;
        sdk: any;
    }
}

// Prevent Iframe issues
if (window.self !== window.top) {
    function preventScroll(event: Event): void {
        let target = event.target as HTMLElement | null;

        while (target && target !== document.body) {
            const overflowY = getComputedStyle(target).overflowY;

            const scrollable = overflowY === "auto" || overflowY === "scroll";

            if (scrollable) {
                return;
            }

            target = target.parentElement;
        }

        event.preventDefault();
    }

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });

    // Prevent keys scroll
    document.addEventListener("keydown", (event) => {
        const keysToPrevent = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "];

        if (keysToPrevent.includes(event.key)) {
            const target = event.target as HTMLElement;

            const allowedTags = ["INPUT", "TEXTAREA", "SELECT", "BUTTON"];

            if (
                event.key === " " &&
                (allowedTags.includes(target.tagName) || target.isContentEditable)
            ) {
                return;
            }

            event.preventDefault();
        }
    });
}

function isWithinGameMonetize(): boolean {
    try {
        if (window !== window.parent && document.referrer) {
            const parentOrigin = new URL(document.referrer).origin;
            return parentOrigin.includes("gamemonetize");
        }
        return window.location.href.includes("gamemonetize");
    } catch (error) {
        console.error("Error in isWithinGameMonetize:", error);
        return window.location.href.includes("gamemonetize");
    }
}

class SDKManager {
    isGameMonetize = isWithinGameMonetize();
    isAnySDK: boolean;

    respawns: number[] = [];

    adCallback = () => { };

    constructor() {
        this.isAnySDK = this.isGameMonetize;
    }

    async init() {
        if (this.isAnySDK) {
            $("#btn-start-fullscreen").hide();

            $("#left-column").hide();
            $("#btn-discord-top-right").show();
            $(".surviv-shirts")
                .css("background-image", "url(./img/discord-promo.png)")
                .html(`<a href="https://discord.gg/6uRdCdkTPt" target="_blank"></a>`);
        } else {
            $(".btn-kofi").show();
            $(".surviv-shirts")
                .css("background-image", "url(./img/survev-kofi.png)")
                .html(`<a href="https://ko-fi.com/survev" target="_blank"></a>`);
        }

        if (this.isGameMonetize) {
            this.initGameMonetize();
        }
    }

    requestMidGameAd(callback: () => void): void {
        if (this.isGameMonetize) {
            this.requestGameMonetizeMidgameAd(callback);
        } else {
            callback();
        }
    }

    async getPlayerName(): Promise<string | undefined> {
        return undefined;
    }

    async getInviteLink(roomID: string): Promise<string | undefined> {
        return undefined;
    }

    getRoomInviteParam() {
        return undefined;
    }

    private requestGameMonetizeMidgameAd(callback: () => void): void {
        if (window.sdk && window.sdk.showBanner) {
            window.sdk.showBanner();
            this.adCallback;
        } else {
            callback();
        }
    }

    private initGameMonetize() {
        const gameMonetizeScript = document.createElement("script");
        gameMonetizeScript.src = "https://api.gamemonetize.com/sdk.js";
        gameMonetizeScript.id = "gamemonetize-sdk";
        document.head.appendChild(gameMonetizeScript);

        window.SDK_OPTIONS = {
            gameId: import.meta.env.VITE_GAMEMONETIZE_ID,
            onEvent: (event: any) => {
                switch (event.name) {
                    case "SDK_GAME_START":
                        this.adCallback();
                        this.adCallback = () => { };
                        break;
                    case "SDK_READY":
                        console.log("Successfully loaded GameMonetize SDK"); // never happens for some reasons
                        break;
                }
            },
        };
    }
}

export const SDK = new SDKManager();
