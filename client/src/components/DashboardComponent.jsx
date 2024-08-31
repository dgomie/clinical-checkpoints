import { Container } from "@mui/material";
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
    <Container sx={{ paddingBottom: '50px', display: "flex", justifyContent: 'center', alignItems: 'center'  }}>
      Welcome, {userFirstName}
    </Container>
  );
};

export default DashboardComponent;
