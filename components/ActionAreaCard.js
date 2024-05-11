import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

export default function ActionAreaCard(props) {
  return (
    <Card
      style={{
        width: "600px",
        height: "640px",
        borderRadius: "2rem",
        // position: "relative",
        // left: "-10px",
      }}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          image={props.image}
          alt={props.name}
          style={{
            borderRadius: "2rem 2rem 0 0",
            objectFit: "cover",
            height: "520px",
            // position: "relative",
            // left: "0px",
          }}
        />
        <CardContent style={{ background: "#55c7f9", minHeight: "100px" }}>
          <Typography gutterBottom variant="h5" component="div">
            {props.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
