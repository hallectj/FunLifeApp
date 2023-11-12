import Fuse from "fuse.js";
import { ISong2 } from "src/app/models/shared-models";

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

function performFuzzySearch(values: string[], searchTerm: string) {
  let fuse = new Fuse(values, {
    threshold: 0.3, 
  });
  const results = fuse.search(searchTerm);
  return results.map(result => result.item);
}

export function searchSongArtistPairs(songData: any[], query: string): ISong2[] {
  const fuseOptions = {
    keys: ['song', 'artist'], // Specify the properties to search on
    includeScore: true, // Include a score for each match
    threshold: 0.3, // Adjust the matching threshold as needed
  };

  // Initialize the Fuse instance with your song data
  const fuse = new Fuse(songData, fuseOptions);
  const results = fuse.search(query);
  return results.map((result) => result.item);
}

export function findMatchingName(input: string, values: string[]): string {
  const normalizedInput = input.normalize("NFD").replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase();
  const fuzzyResults = performFuzzySearch(values, normalizedInput);
  //Keep this code commented out in case I need to go back to this
  //for (const v of values) {
    //const normalizedName = v.normalize("NFD").replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase();
    //if (normalizedName === normalizedInput) {
      //return v;
    //}
  //}
  return fuzzyResults[0];
}

export function isValidDate(month: string, day: string, regardLeapYear: boolean, includeFeb29: boolean) {
  // Define a mapping of months and their respective maximum day counts
  const monthToDays = {
    January: 31,
    February: (includeFeb29) ? 29 : 28, // 29 in leap years
    March: 31,
    April: 30,
    May: 31,
    June: 30,
    July: 31,
    August: 31,
    September: 30,
    October: 31,
    November: 30,
    December: 31,
  };

  // Validate the month input
  if (!(month in monthToDays)) {
    return false; // Invalid month
  }

  // Convert the day input to a number
  let dayNum = parseInt(day, 10);

  // Check for leap year
  const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);

  // Handle February and its valid day range based on whether it's a leap year
  if (regardLeapYear && month === "February") {
    if (isLeapYear(new Date().getFullYear())) {
      if (dayNum < 1 || dayNum > 29) {
        return false; // Invalid day for a leap year
      }
    } else {
      if (dayNum < 1 || dayNum > 28) {
        return false; // Invalid day for a non-leap year
      }
    }
  } else {
    // Check the day range for other months
    if (dayNum < 1 || dayNum > monthToDays[month]) {
      return false; // Invalid day for the given month
    }
  }

  // If all checks passed, it's a valid date
  return true;
}
