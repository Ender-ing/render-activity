/**
 * 
 * Manage nonce attribute in vite output
 * 
**/

export function appendNonce() {
    return {
        name: 'append-nonce-attribute',
        transformIndexHtml(html) {
            let newHTML = html;
            // <script>
            newHTML = newHTML.replaceAll(/<script(.*?)>/gi, '<script nonce="<?php echo $NONCE; ?>" $1>');
            // <link rel=preload ..>
            newHTML = newHTML.replaceAll(/<(.*?)as\=\"script\"(.*?)>/gi, '<$1as="script" nonce="<?php echo $NONCE; ?>" $2>');
            newHTML = newHTML.replaceAll(/<(.*?)rel\=\"modulepreload\"(.*?)>/gi, '<$1rel="modulepreload" nonce="<?php echo $NONCE; ?>" $2>');
            return newHTML;
        }
    };
}