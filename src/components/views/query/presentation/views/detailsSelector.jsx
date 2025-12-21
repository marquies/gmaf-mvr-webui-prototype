import React from 'react';
import Details2 from './details';
import AlternativeDetails from './alternativeDetails';
import config from '../../../../../config/config';

/**
 * Component that selects which details view to render based on configuration
 */
function DetailsSelector({ mmfgid }) {
  // Use the configuration parameter to determine which view to render
  return config.useAlternativeDetailsView ? 
    <AlternativeDetails mmfgid={mmfgid} /> : 
    <Details2 mmfgid={mmfgid} />;
}

export default DetailsSelector;
