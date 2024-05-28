type Props = {
  text: string;
  fieldsData: Record<string, string[]>;
};

const ErrorContainer: React.FC<Props> = ({ text, fieldsData }) => {
  return (
    <>
      <div>{text}</div>
      <ul>
        {Object.values(fieldsData).map((value, index) => (
          <li key={index}>{[value]}</li>
        ))}
      </ul>
    </>
  );
};

export default ErrorContainer;
