import { message } from "antd"
import { useAppDispatch, useAppSelector } from "./redux"
import { fetchAllLandLot } from "@redux/feature/land/landThunk"
import { useEffect } from "react"
import { Status } from "@lib/constants/enum"

export const useLotHook = () => {
    const dispatch = useAppDispatch()
    const { lot, status } = useAppSelector(state => state.land)

    const fetchLotData = async () => {
        try {
            await dispatch(fetchAllLandLot()).unwrap()
        }
        catch (error) {
            message.error(error || 'Failed to fetch lot data')
        }
    }

    useEffect(() => {
        if (status.lot.fetch === Status.IDLE) {
            fetchLotData()
        }
    }, [status.lot.fetch])

    const lotOptions = lot.map(item => ({
        label: item.lotNumber,
        value: item.lotId
    }))

    return {
        lotOptions,
        lot
    }
}   