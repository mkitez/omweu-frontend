import { Tooltip } from 'antd';
import { useTranslation } from 'next-i18next';
import { DriverPreferences } from '../Trips';
import { booleanFields, defaultValues } from '../DriverPreferencesFormFields';
import PackageIcon from '../../assets/amenities/box-svgrepo-com.svg';
import TwoPassengersIcon from '../../assets/amenities/couple-svgrepo-com.svg';
import PetIcon from '../../assets/amenities/dog-svgrepo-com.svg';
import FoodIcon from '../../assets/amenities/burger-fast-fastfood-svgrepo-com.svg';
import MusicIcon from '../../assets/amenities/music-svgrepo-com.svg';
import SmokingIcon from '../../assets/amenities/smoking-cigar-svgrepo-com.svg';
import ManIcon from '../../assets/amenities/man-hair-head-svgrepo-com.svg';
import WomanIcon from '../../assets/amenities/woman-hair-head-svgrepo-com.svg';
import styles from './TripDetails.module.css';

const fieldIconMappings: Partial<
  Record<keyof DriverPreferences, React.FunctionComponent>
> = {
  can_deliver: PackageIcon,
  max_two_on_backseat: TwoPassengersIcon,
  pets_allowed: PetIcon,
  food_allowed: FoodIcon,
  music_allowed: MusicIcon,
  smoking_allowed: SmokingIcon,
};

type Props = {
  amenities: DriverPreferences | null;
};

const Amenities: React.FC<Props> = ({ amenities }) => {
  const { t } = useTranslation('dashboard');

  if (!amenities) {
    return null;
  }

  return (
    <div className={styles.amenities}>
      {booleanFields.map((field) => {
        if (amenities[field] === defaultValues[field]) {
          return null;
        }
        const IconComponent = fieldIconMappings[field];
        if (!IconComponent) {
          throw Error(`No icon found for field: ${field}`);
        }
        return (
          <Tooltip
            key={field}
            title={t(`driver_preferences.labels.${field}`)}
            placement="bottomLeft"
            overlayClassName={styles.amenitiesTooltip}
          >
            <div className={styles.amenitiesIcon}>
              <IconComponent />
            </div>
          </Tooltip>
        );
      })}
      {amenities.gender !== defaultValues.gender && (
        <Tooltip
          title={t(
            `driver_preferences.gender_values.${
              amenities.gender ? 'male' : 'female'
            }`
          )}
          placement="bottomLeft"
          overlayClassName={styles.amenitiesTooltip}
        >
          <div className={styles.amenitiesIcon}>
            {amenities.gender ? <ManIcon /> : <WomanIcon />}
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default Amenities;
