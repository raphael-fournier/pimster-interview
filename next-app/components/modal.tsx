import { FC, useEffect } from "react";
import styles from "../styles/Modal.module.css";
import { useLazyQuery, gql } from "@apollo/client";
import { createPortal } from "react-dom";

const GET_LAUNCH_INFO = gql`
  query launch($launchId: ID!) {
    launch(id: $launchId) {
      mission_name
      launch_success
      launch_date_local
      launch_site {
        site_name
      }
      details
      links {
        flickr_images
        mission_patch
      }
    }
  }
`;

type cardProps = {
  launchId: string;
  setSelectedLaunchId: (id: string) => void;
  launchIds: string[];
};

const Modal: FC<cardProps> = ({ launchId, setSelectedLaunchId, launchIds }) => {
  const [getLaunchInfos, { loading, error, data }] =
    useLazyQuery(GET_LAUNCH_INFO);

  useEffect((): void => {
    getLaunchInfos({ variables: { launchId: launchId } });
  }, [launchId]);

  const hideModal = (): void => {
    setSelectedLaunchId("");
  };

  const switchLaunchId = (way: string): void => {
    let newLaunchId: string | null = null;

    if (way === "next") {
      newLaunchId = launchIds[launchIds.indexOf(launchId) + 1];
    }
    if (way === "prev") {
      newLaunchId = launchIds[launchIds.indexOf(launchId) - 1];
    }
    if (newLaunchId !== null) setSelectedLaunchId(newLaunchId);
  };

  if (error) return <>{"An error occured fetching data"}</>;
  if (loading) return <>{"Loading"}</>;

  return data
    ? createPortal(
        <>
          <div className={styles.overlay} onClick={hideModal}>
            <div className={styles.wrapper}>
              <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.imageWrapper}>
                  <img
                    className={styles.image}
                    src={
                      data.launch.links.flickr_images[0] ||
                      data.launch.links.mission_patch ||
                      "https://upload.wikimedia.org/wikipedia/commons/d/d1/Falcon_Heavy_Demo_Mission_%2839337245145%29.jpg"
                    }
                    alt="rocket launch"
                  />
                </div>
                <div className={styles.body}>
                  <h2>{data.launch.mission_name}</h2>
                  <p>
                    Launch date:{" "}
                    {new Date(data.launch.launch_date_local).toLocaleDateString(
                      "en-US"
                    )}
                  </p>
                  <p>Launch site: {data.launch.launch_site.site_name}</p>
                  <p>
                    Launch success: {data.launch.launch_success ? "Yes" : "No"}
                  </p>
                  <p>{data.launch.details}</p>

                  <button
                    type="button"
                    className={styles.closeButton}
                    onClick={hideModal}
                  >
                    <span>&times;</span>
                  </button>

                  {launchIds[0] !== launchId && (
                    <button
                      type="button"
                      className={styles.prevButton}
                      onClick={() => switchLaunchId("prev")}
                    >
                      <span className={`${styles.arrow} ${styles.left}`}></span>
                    </button>
                  )}
                  {launchIds[-1] !== launchId && (
                    <button
                      type="button"
                      className={styles.nextButton}
                      onClick={() => switchLaunchId("next")}
                    >
                      <span
                        className={`${styles.arrow} ${styles.right}`}
                      ></span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>,
        document.body
      )
    : null;
};

export default Modal;
