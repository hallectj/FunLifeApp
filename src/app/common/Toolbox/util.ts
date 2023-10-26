export function slugify(str: string) {
  const sluggedStr = String(str)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/[^a-zA-Z0-9 -]/g, '') // Change to include capital letters
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  return sluggedStr;
}

export function deslugify(title: string){
  let s = title.replace(/-/g, " ");
  return s;
}

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function findMatchingName(input: string, values: string[]): string {
  const normalizedInput = input.normalize("NFD").replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase();

  for (const v of values) {
    const normalizedName = v.normalize("NFD").replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase();
    if (normalizedName === normalizedInput) {
      return v;
    }
  }
  
  return "";
}