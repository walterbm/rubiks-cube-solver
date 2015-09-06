# 2x2x2 BFS Rubik's Cube Solver

## Description

Rails application to visualize and solve the 2 × 2 × 2 Rubik’s Cube in the fewest possible twists. The Cube is solved using a Ruby implementation of the two-way Breadth-First Search algorithm and visualized using the JavaScript library three.js. A 2 x 2 x 2 Rubik's Cube has 3,674,160 possible combinations and the application has been optimized to find a solution in less than 5 seconds.


## Screenshots

![Rubik Solver home page](screenshots/rubiks-solver-home.png "Home page for the Rubik Solver app with the 3D cube created with three.js")
Home page for the Rubik Solver app showing the 3D cube created with three.js.

![Rubik Solver shuffled](screenshots/rubik-solver-shuffled.png "The cube can be randomly shuffled while maintaining geometry like any real-world Rubik's cube.")
The cube can be randomly shuffled while maintaining geometry like any real-world Rubik's cube.

![Rubik Solver solved](screenshots/rubik-solver-solved.png "Uses DFS to automatically find the shortest number of moves to solve the Rubik's cube.")
Uses DFS to automatically find the shortest number of moves to solve the Rubik's cube.

## Background

Inspired by MIT's 6.006 "Introduction to Algorithms" class which uses this Rubik's Cube problem to teach [Breadth-First Search](https://www.youtube.com/watch?v=s-CYnVz-uh4) and algorithmic optimization. 

## Features

+ Ruby implementation of the two-way Breadth-First Search algorithm
+ 3D visualization of the Rubik's Cube using three.js

## Development/Contribution

Please feel free to contribute to the project. 

## Future

Maybe in the future I will attempt to create a solver for the classic Rubik's Cube. A 3 x 3 x 3 Rubik's Cube has over 43 quintillion possible combinations and requires [specialized algorithms](https://www.cs.princeton.edu/courses/archive/fall06/cos402/papers/korfrubik.pdf) to help reduce the complexity of the problem. 

## Created by:

- [Walter Beller-Morales](https://github.com/walterbm)

## License

Rubik's Cube Solver is MIT Licensed. See LICENSE for details.