import useSWR from 'swr';
import { FC } from "react"
import { Booking } from "../../pages/bookings/[bookingId]"
import { useTranslation } from "next-i18next"
import { useSession } from "next-auth/react"
import api from "../../services/api"

type Props = {
  tripId: number
}

const InlineBooking: FC<Props> = ({ tripId }) => {
  const { data: session } = useSession();
  const { i18n } = useTranslation(['dashboard', 'common']);
  const {
    data: booking,
    error,
    isLoading,
  } = useSWR<Booking>(`/trips/${tripId}/booking/`, async (url) => {
    const response = await api.get(url, {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        'Accept-Language': i18n.language,
      },
    });
    return response.data;
  });
  
  if (isLoading || !booking) {
    return null;
  }

  return <div>
    {booking.is_confirmed ? "Booking confirmed" : "Booking not yet confirmed"}
  </div>
}

export default InlineBooking;
