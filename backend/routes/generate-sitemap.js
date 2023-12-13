const generateSitemap = () => {
  const routes = [
    '',
    'celebrities',
    'birthday',
    'posts/2/Why-the-1970s-was-Awesome!',
    'posts/3/Top-Weird-Al-Parody-Songs-of-All-Time',
    'posts/4/Taylor-Swift-Top-Songs',
    'posts/5/Top-Grossing-Movies-Each-Year-Since-2000',
    'posts/6/Twelve-of-the-Richest-Musical-Artist',
    'posts/8/What-Was-Life-Like-Before-Cell-Phones'
    // Add more routes as needed
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonths = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const years = Array.from({ length: 2020 - 1950 + 1 }, (_, index) => 1950 + index);
  let dynamicRoutes = [];
  for (let i = 0; i < years.length; i++) {
    const dynamicRoute = "charts/hot-hundred-songs/" + years[i];
    dynamicRoutes.push(dynamicRoute);
  }

  for (let i = 0; i < months.length; i++) {
    let month = months[i];
    for (let j = 0; j < daysInMonths[i]; j++) {
      dynamicRoutes.push(`day-in-history/${month}/${j + 1}`);
    }
  }

  let allRoutes = [...routes, ...dynamicRoutes];

  const sitemapData = allRoutes.map(route => ({
    loc: `https://backthennow.com/${route}`,
    changefreq: 'weekly',
    priority: '0.8'
  }));

  return sitemapData;
};

module.exports = generateSitemap;