"use client"
import StageProgress from '@/components/common/StageProgress'
import { Steps } from 'antd'
import React from 'react'

const WorkSteps = [
    {
        title: 'Deposite',
    },
    {
        title: 'Concept',
    },
    {
        title: 'Colour Selection',
    },
    {
        title: 'Contract Drawing',
    },
    {
        title: 'Approval & Contract',
    },
    {
        title: 'Permits & Pre Construction',
    },
]

const index = () => {
    return (
        <>
        <div>
            <StageProgress 
                id="MY12F48"
                title="Job Status"
                steps={[]}
                status='In Progress'
                idClassName="text-[#]"
            />
        </div>
        <div className='m-3'>
            <Steps
                current={1}
                labelPlacement="vertical"
                items={WorkSteps}
                />
        </div>
                </>
    )
}

export default index