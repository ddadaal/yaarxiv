import { GetServerSideProps, NextPage } from "next";

export const DashboardIndexPage: NextPage = () => {
  return (
    <></>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return { redirect: { destination: "/dashboard/articles", permanent: true  } };
};

export default DashboardIndexPage;
