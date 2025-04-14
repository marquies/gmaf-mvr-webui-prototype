import React, { useState } from 'react';
import GMAFAdapter from '../../../../js/GMAFAdapter';

export function useQueryHandler(setValue) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchIds = async (tags) => {
        setIsLoading(true);
        setError(null);
        try {
            const gmaf = await GMAFAdapter.getInstance();
            if (!gmaf) {
                throw new Error('Failed to initialize GMAF adapter');
            }

            const keywords = tags.map(tag => tag.text).join(',');
            return await gmaf.getQueryIds(keywords);
        } catch (error) {
            console.error('Error fetching query IDs:', error);
            setError(error.message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        fetchIds
    };
}
