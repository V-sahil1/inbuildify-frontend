import React, { useState } from 'react'
import JobVariation from './JobVariation'
import { JobVariationData } from 'data/sampleData'
import JobVariationCreatePage from './JobVariationCreatePage'
import JobVariationStatusTracker from './JobVariationStatusTracker'


const JobVariationManager = () => {
    const [activeScreen, setActiveScreen] = useState<'list' | 'createVariation' | 'statusTracker'>('list')
    return (
        <>
            {activeScreen === 'list' && <JobVariation data={JobVariationData} setActiveScreen={setActiveScreen} />}
            {activeScreen === 'createVariation' && <JobVariationCreatePage setActiveScreen={setActiveScreen} />}
            {activeScreen === 'statusTracker' && <JobVariationStatusTracker />}
        </>
    )
}

export default JobVariationManager