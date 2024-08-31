import { Container, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Auth from "../utils/auth";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_BY_ID } from "../utils/queries";

const DashboardComponent = () => {
  const navigate = useNavigate();
  const user = Auth.getProfile();
  const userId = user?.data?._id;

  console.log(userId)

  const { loading, error, data } = useQuery(GET_USER_BY_ID, {
    variables: { id: userId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const userFirstName = data?.userById?.firstName;


  return (
    <Container >
        <Paper
          elevation={3}

          sx={{ marginBottom: 2, padding: { xs: 2, sm: 4, md: 6 } }}
        >
          <Typography variant="h4" component="header">
            Welcome {userFirstName}
          </Typography>
        </Paper>
    </Container>
  );
};

export default DashboardComponent;
