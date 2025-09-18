import React from 'react'

const LeadUpdateDetail = ({ label, value }: { label: string, value: string }) => {
    return (
        <div className='grid grid-cols-8 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 text-sm items-center mb-2' >
            <div className='col-span-2 sm:col-span-1 md:col-span-2 lg:col-span-3 font-semibold'>{label}:</div>
            <div className='col-span-3 lg:col-span-5'><p>{value || 'N/A'}</p></div>
        </div>
    )
}

export default LeadUpdateDetail;
