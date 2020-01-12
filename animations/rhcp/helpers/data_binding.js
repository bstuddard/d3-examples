class DataBinder {
    /**
     * Called by build method, do not call directly. Ex: const databinder = await DataBinder.build('./../../data.json');
     * @param  {Object} dataset   Dataset built by build method.
     */
    constructor(dataset){
      this.dataset = dataset;
      this.accessor_list = new Object();
    }

    /**
     * Builds a DataBinder object given location of the dataset.
     * @param   {String} location   Location of the dataset.
     * @returns {Object}            Newly built DataBinder object with dataset initialized.
     */
    static async build(location){
        const load_method = DataLoaders.determine_load_method(location);
        const dataset_loaded = await DataLoaders.load_dataset(load_method, location);
        return new DataBinder(dataset_loaded);
    }

    /**
     * Adds an accessor to a list of accessors
     * @param  {String}     accessor_key        Key for a particular accessor.
     * @param  {Function}   accessor_function   Actual accessor function.
     */
    add_accessor(accessor_key, accessor_function){
        this.accessor_list[accessor_key] = accessor_function;
    }

    /**
     * Gets d3 extent for a particular accessor key.
     * @param   {String}     accessor_key        Key for a particular accessor.
     * @returns {Object}                         d3 extent (min/max array).
     */
    get_extent(accessor_key){
        return d3.extent(this.dataset, this.accessor_list[accessor_key]);
    }

}

class DataLoaders{
    constructor(){}

    /**
     * Do not call directly, helper loader methods used by DataBinder Object.
     * @param   {String} location   Location of the dataset.
     * @returns {String}            Load method string (ex: json).
     */
    static determine_load_method(location){
        const string_length = location.length;
        let load_method;
        if(location.substr((string_length - 4)) == 'json'){
            load_method = 'json';
        } else {
            load_method = 'error';
            console.log('load method error.');
            throw new Error('Invalid data load method.');
        }
        return load_method;
    }

    /**
     * Do not call directly, helper loader methods used by DataBinder Object.
     * @param   {String} load_method     Load method (ex: json).
     * @param   {String} location        Location of the dataset.
     * @returns {Object}                 Dataset object returned from d3 load method.
     */
    static async load_dataset(load_method, location){
        let dataset;
        if(load_method == 'json'){
            dataset = await d3.json(location);
        } else {
            throw new Error('Invalid load method.');
        }
        return dataset;
    }

}