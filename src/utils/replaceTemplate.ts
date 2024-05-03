import { config } from '../../config';
export const replaceTemplate = (template: string, replacements: Record<string, any>): string => {
    const safeLinksUrl = config.safeLinks ? config.safeLinkUrlApi : '';

    Object.keys(replacements).forEach((key) => {
        if (Array.isArray(replacements[key])) {
            const linksHtml = replacements[key]
                .map((link: any) => `<li><a href="${safeLinksUrl}${link}">${link}</a></li>`)
                .join("");
            template = template.replace(new RegExp(`{{${key}}}`, 'g'), linksHtml);
        } else {
            template = template.replace(new RegExp(`{{${key}}}`, 'g'), replacements[key]);
        }
    });
    return template;
};