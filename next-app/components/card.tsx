import { FC } from "react";
import styles from "../styles/Card.module.css";

type cardProps = {
  id: string;
  missionName: string;
  launchDate: string;
  rocketName: string;
  image: string;
};

const Card: FC<cardProps> = (props) => {
  return (
    <div className={styles.card}>
      <img src={props.image} alt="rocket launch" className={styles.image} />
      <div className={styles.cardText}>
        <h4>
          <b>{props.missionName}</b>
        </h4>
        <p>{props.launchDate}</p>
      </div>
    </div>
  );
};

export default Card;
