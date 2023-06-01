import { GetServerSideProps } from 'next';

// eslint-disable-next-line import/no-anonymous-default-export
export default () => null;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    notFound: true,
  };
};
