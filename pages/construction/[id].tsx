import React from 'react'
import { useRouter } from 'next/router'
import StageProgress from '@/components/common/StageProgress'

const index = () => {
    const router = useRouter()
    const { id } = router.query
    const normalizedId = Array.isArray(id) ? id[0] : id
    console.log("id:", normalizedId)
    return (
        <div className='p-3'>
            <div className='flex gap-3'>
                <StageProgress
                    id={normalizedId}
                    title="Construction"
                    steps={[]}
                    />
                <div className='w-full border flex justify-evenly'>
                    {/* Info */}
                    <div></div>
                    {/* dates */}
                    <div>Add Note</div>
                    {/* buttons */}
                    <div>Add Document</div>
                </div>
            </div>
        </div>
    )
}

export default index