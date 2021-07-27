import { GetServerSideProps, NextPage } from "next";

export const DashboardIndexPage: NextPage = () => {
  return (
    <></>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return { redirect: { destination: "/dashboard/profile", permanent: true  } };
};

export default DashboardIndexPage;
