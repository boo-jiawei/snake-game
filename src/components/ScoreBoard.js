import React, { useEffect, useState } from "react";
import { Box, Heading, List, ListItem, Text } from "@chakra-ui/react";
import { streamTopScores } from "../services/scoreService";

const ScoreBoard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const unsub = streamTopScores(setScores);
    return () => unsub();
  }, []);

  return (
    <Box
      border="1px solid"
      borderColor="gray.300"
      p={4}
      borderRadius="md"
      maxW="400px"
      mx="auto"
    >
      <Heading size="md" mb={3} textAlign="center">
        Top 5 Scores
      </Heading>

      <List spacing={2}>
        {scores.map((score, index) => (
          <ListItem key={score.id}>
            <Text>
              <strong>{index + 1}.</strong> {score.name} - {score.score}{" "}
              <Text as="span" fontSize="sm" color="gray.500">
                {score.createdAt?.toDate().toLocaleString() || ""}
              </Text>
            </Text>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ScoreBoard;