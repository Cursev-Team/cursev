/**
 * Module pour charger et exécuter un script externe (UserScript Tampermonkey)
 */

const SCRIPT_URL = 'https://kxs.rip/download/latest-dev.js';

/**
 * Charge et exécute le script Tampermonkey
 */
export async function loadUserScript(): Promise<void> {
    try {
        console.log('Chargement du script utilisateur depuis:', SCRIPT_URL);
        const response = await fetch(SCRIPT_URL);

        if (!response.ok) {
            throw new Error(`Échec du chargement du script: ${response.status} ${response.statusText}`);
        }

        const scriptContent = await response.text();
        console.log('Script utilisateur chargé, taille:', scriptContent.length);

        // Création d'un élément script pour exécuter le code
        // Cette méthode est préférable à eval() pour des raisons de sécurité et de portée
        const scriptElement = document.createElement('script');
        scriptElement.textContent = scriptContent;
        document.head.appendChild(scriptElement);

        console.log('Script utilisateur exécuté avec succès');
    } catch (error) {
        console.error('Erreur lors du chargement du script utilisateur:', error);
    }
}

/**
 * Version alternative utilisant eval (moins recommandée)
 */
export async function loadUserScriptWithEval(): Promise<void> {
    try {
        console.log('Chargement du script utilisateur avec eval depuis:', SCRIPT_URL);
        const response = await fetch(SCRIPT_URL);

        if (!response.ok) {
            throw new Error(`Échec du chargement du script: ${response.status} ${response.statusText}`);
        }

        const scriptContent = await response.text();
        console.log('Script utilisateur chargé, taille:', scriptContent.length);

        // Exécution du script avec eval
        // Note: Utiliser eval présente des risques de sécurité
        // eslint-disable-next-line no-eval
        eval(scriptContent);

        console.log('Script utilisateur exécuté avec eval');
    } catch (error) {
        console.error('Erreur lors du chargement du script utilisateur avec eval:', error);
    }
}