/** API names carry singular|plural forms ("Minuteman|Minutemen"); keep the first one. */
export function cleanName(value: string | undefined): string {
    return value?.split('|')[0] ?? '';
}

/** Accent- and case-insensitive key used to match a name against a search query. */
export function searchKey(value: string): string {
    return cleanName(value).normalize('NFD').replace(/[̀-ͯ]/g, '').toLocaleLowerCase().trim();
}
