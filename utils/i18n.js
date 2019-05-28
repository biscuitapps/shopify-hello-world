import messages from './messages';

const def_lang = 'en';

export default function(locale, key) {
    if (messages[locale]) {
        return messages[locale][key];
    } else {
        return messages[def_lang][key];
    }
}
