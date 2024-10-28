class Filter {
    static filter(cmmcoArray, filterObject) {

        // Safety checks for the cmmcoArray
        if (!Array.isArray(cmmcoArray) || cmmcoArray.length === 0) {
            return []; // Return an empty array if the input is not a valid array or is empty
        }
    
        return cmmcoArray.filter(cmmco => {
            const md = cmmco.md;
            const date= new Date(md.Date);
            const roundedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            // Check each property in the filter object
            const matchesName = filterObject.name ? md.name.includes(filterObject.name) : true;
            const matchesType = filterObject.type ? md.type.includes(filterObject.type) : true;
            const matchesFromDate = filterObject.fromDate ? roundedDate >= new Date(filterObject.fromDate) : true;
            const matchesToDate = filterObject.toDate ? roundedDate <= new Date(filterObject.toDate) : true;

            // Return true if all conditions match
            return matchesName && matchesType && matchesFromDate && matchesToDate;
        });
    }
}

export default Filter;

