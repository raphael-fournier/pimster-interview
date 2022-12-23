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
  hide: () => void;
};

const Modal: FC<cardProps> = (props) => {
  const [getLaunchInfos, { loading, error, data }] =
    useLazyQuery(GET_LAUNCH_INFO);

  useEffect((): void => {
    getLaunchInfos({ variables: { launchId: props.launchId } });
  }, [props.launchId]);

  if (error) return <>{"An error occured fetching data"}</>;
  if (loading) return <>{"Loading"}</>;

  return data
    ? createPortal(
        <>
          <div className={styles.overlay} onClick={props.hide}>
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
                      ""
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
                    onClick={props.hide}
                  >
                    <span>&times;</span>
                  </button>
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
