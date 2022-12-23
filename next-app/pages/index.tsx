import { gql, useQuery } from "@apollo/client";
import type { GetStaticProps, NextPage } from "next";
import HomePageHead from "../components/head/homePageHead";
import { initializeApollo } from "../lib/apolloClient";
import styles from "../styles/Home.module.css";
import Card from "../components/card";
import Modal from "../components/modal";
import { useState } from "react";

const GET_LAST_LAUNCHES = gql`
  query GET_LAST_LAUNCHES {
    launchesPast(limit: 16) {
      id
      mission_name
      launch_date_local
      rocket {
        rocket_name
      }
      links {
        flickr_images
        mission_patch
      }
    }
  }
`;

const Home: NextPage = () => {
  const { loading, error, data } = useQuery(GET_LAST_LAUNCHES);
  const [selectedLaunchId, setSelectedLaunchId] = useState<string>("");

  if (error) return <>{"An error occured fetching data"}</>;
  if (loading) return <>{"Loading"}</>;

  return (
    <div className={styles.container}>
      <HomePageHead />
      <div className={styles.cardsContainer}>
        {data?.launchesPast?.map((launch: any) => {
          return (
            <div onClick={() => setSelectedLaunchId(launch.id)}>
              <Card
                key={launch.id}
                id={launch.id}
                missionName={launch.mission_name}
                launchDate={launch.launch_date_local}
                rocketName={launch.rocket.rocket_name}
                image={
                  launch.links.flickr_images[0] ||
                  launch.links.mission_patch ||
                  "https://upload.wikimedia.org/wikipedia/commons/d/d1/Falcon_Heavy_Demo_Mission_%2839337245145%29.jpg"
                }
              />
            </div>
          );
        })}
      </div>
      {selectedLaunchId && (
        <Modal
          launchId={selectedLaunchId}
          setSelectedLaunchId={setSelectedLaunchId}
          launchIds={data.launchesPast.map((launch: any) => launch.id)}
        />
      )}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo();

  await apolloClient.query({ query: GET_LAST_LAUNCHES });

  return {
    props: {},
  };
};

export default Home;
