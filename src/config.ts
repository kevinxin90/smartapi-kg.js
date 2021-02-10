import { AppConfig } from './utils/types';

const config: AppConfig = {
    FILTER_FIELDS: ["input_type", "output_type", "predicate", "api_name", "source"],
    SMARTAPI_URL: 'https://smart-api.info/api/query?q=tags.name:translator&size=150&fields=paths,servers,tags,components.x-bte*,info,_meta'
}

export = config;