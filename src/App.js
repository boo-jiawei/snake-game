import React, { useState, useCallback, useEffect, useRef } from "react";
import { Box, Flex, Button, Text, useBreakpointValue } from "@chakra-ui/react";
import { GiAcorn } from "react-icons/gi";
import { LuCherry } from "react-icons/lu";

const Grid_Size = 10;
const Initial_Snake = [
  { x: 2, y: 2 },
  { x: 2, y: 1 },
];

const Initial_Direction = { x: 0, y: 1 };

const getRandomFoodPosition = (snake) => {
  let foodPosition;
  do {
    foodPosition = {
      x: Math.floor(Math.random() * Grid_Size),
      y: Math.floor(Math.random() * Grid_Size),
    };
  } while (
    snake.some(
      (snakePosition) =>
        snakePosition.x === foodPosition.x && snakePosition.y === foodPosition.y
    )
  );
  return foodPosition;
};

const App = () => {
  const [snake, setSnake] = useState(Initial_Snake);
  const [direction, setDirection] = useState(Initial_Direction);
  const [food, setFood] = useState(getRandomFoodPosition(Initial_Snake));
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bonusFood, setBonusFood] = useState(null);
  const [foodCount, setFoodCount] = useState(0);
  const bonusFoodTimeout = useRef(null);

  const cellSize = useBreakpointValue({ base: 8, md: 6 });
  const moveSnake = useCallback(() => {
    if (isGameOver) return;

    const newHead = {
      x: snake[0].x + direction.x,
      y: snake[0].y + direction.y,
    };

    //check collide with wall
    if (
      newHead.x < 0 || //wall
      newHead.y < 0 || //wall
      newHead.x >= Grid_Size || //wall
      newHead.y >= Grid_Size ||
      snake.some((s) => s.x === newHead.x && s.y === newHead.y) //wall
    ) {
      setIsGameOver(true);
      return;
    }

    const newSnake = [newHead, ...snake];

    let ateNormalFood = false;
    let ateBonusFood = false;

    //eat food
    if (newHead.x === food.x && newHead.y === food.y) {
      ateNormalFood = true;
      setFood(getRandomFoodPosition(newSnake));
      setScore((prev) => prev + 1);
      setFoodCount((prev) => {
        const newCount = prev + 1;
        if (newCount % 5 === 0) {
          const newBonus = getRandomFoodPosition(newSnake);
          setBonusFood(newBonus);
          if (bonusFoodTimeout.current) clearTimeout(bonusFoodTimeout.current);
          bonusFoodTimeout.current = setTimeout(() => {
            setBonusFood(null);
          }, 6000);
        }
        return newCount;
      });
    } else if (
      bonusFood &&
      newHead.x === bonusFood.x &&
      newHead.y === bonusFood.y
    ) {
      ateBonusFood = true;
      setBonusFood(null);
      setScore((prev) => prev + 5);
    } else {
      newSnake.pop();
    }
    setSnake(newSnake);
  }, [snake, direction, food, isGameOver, bonusFood]);

  useEffect(() => {
    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  }, [moveSnake]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isGameOver) return;
      switch (e.key) {
        case "ArrowUp":
        case "w":
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
        case "s":
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
        case "a":
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
        case "d":
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [direction, isGameOver]);

  const handleRestart = () => {
    setSnake(Initial_Snake);
    setDirection(Initial_Direction);
    setFood(getRandomFoodPosition(Initial_Snake));
    setBonusFood(null);
    setFoodCount(0);
    if (bonusFoodTimeout.current) clearTimeout(bonusFoodTimeout.current);
    setIsGameOver(false);
    setScore(0);
  };

  return (
    <Flex align="center" direction="column" mt={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={2}>
        Snake Game
      </Text>

      <Text fontSize="lg">score: {score}</Text>

      <Box
        mt={4}
        border="2px solid gray"
        display="grid"
        gridTemplateColumns={`repeat(${Grid_Size},${cellSize}vmin)`}
        gridTemplateRows={`repeat(${Grid_Size},${cellSize}vmin)`}
        bg="gray.100"
      >
        {Array(Grid_Size * Grid_Size)
          .fill(null)
          .map((_, idx) => {
            const x = idx % Grid_Size;
            const y = Math.floor(idx / Grid_Size);

            const isHead = snake.length && snake[0].x === x && snake[0].y === y;
            const isSnake = snake.some((s) => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;
            const isBonusFood =
              bonusFood && bonusFood.x === x && bonusFood.y === y;
            return (
              <Box
                key={idx}
                bg={isHead ? "green.700" : isSnake ? "green.500" : "white"}
                border="1px solid"
                borderRadius={isHead ? "10px" : isSnake ? "15px" : 0}
                borderColor="gray.300"
              >
                {isFood && <GiAcorn color="brown" size="80%" />}
                {isBonusFood && <LuCherry color="red" size="80%" />}
              </Box>
            );
          })}
      </Box>

      {isGameOver && (
        <Box mt={4} textAlign="center">
          <Text fontSize="xl" color="red.500" fontWeight="bold">
            Game Over!
          </Text>
          <Button mt={2} colorScheme="teal" onClick={handleRestart}>
            Restart
          </Button>
        </Box>
      )}
    </Flex>
  );
};

export default App;
