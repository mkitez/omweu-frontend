import { capitalizeFirstLetter } from '../../utils/commonUtils';

type Props = {
  errors: string[] | undefined;
};

const ValidationHelpMessage: React.FC<Props> = ({ errors }) => {
  if (!errors) {
    return null;
  }

  return (
    <>
      {errors.map((error, i) => (
        <>
          <span key={i}>{capitalizeFirstLetter(error)}</span>
          <br />
        </>
      ))}
    </>
  );
};

export default ValidationHelpMessage;
