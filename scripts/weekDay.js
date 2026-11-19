// ------- 15f. Move isweekend() into a separate file and use export default. Import this function in another file and run it.

// ------- 15g. We can also rename a default export when we inport. In 15f, when we "import isSatSun" and use this new name to the function.

export default function isWeekend(date) {
    const dayOfWeek = date.format('dddd').toLowerCase();
    return dayOfWeek === 'saturday' || dayOfWeek === 'sunday';
}