const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

const generateRandomNumber = (number) => {
    return Number((Math.random() * number).toFixed());
}



class Field {
    constructor(field) {
        this.field = field,
            this.y = generateRandomNumber(field.length - 1),
            this.x = generateRandomNumber(field[0].length - 1)
    }

    // Sets the pathCharacter on a previously set random point from constructor
    setStartingPoint() {
        this.field[this.y][this.x] = pathCharacter;
    }

    // Whole game logic
    play() {
        this.setStartingPoint();
        let currentPoint = {
            x: this.x,
            y: this.y,
            exitMove: false
        }

        while (!currentPoint.exitMove) {
            console.clear();
            console.log(`Starting point:
X: ${currentPoint.x + 1}
Y: ${currentPoint.y + 1}
`);
            this.print();
            console.log(this.checkValidity() ? 'You can solve this game!' : 'This game can\'t be solved. Try again');
            this.deleteStarting();
            console.log(`Choose your next move:
                              d - down,
                              u - up,
                              r - right,
                              l - left,
                              q - close the game,
                              a - add more holes(make it harder!)
`);
            const nextMove = prompt('>  ');
            this.move(nextMove, currentPoint);
            console.log(currentPoint);

            if ((currentPoint.x >= this.field[0].length) || (currentPoint.x < 0) || (currentPoint.y < 0) || (currentPoint.y >= this.field.length)) {
                console.log('You lost. Try again!');
                currentPoint.exitMove = true;
            };

            if (currentPoint.exitMove !== true) {
                this.changeField(currentPoint);
            }
            // this.hardMode();
        };
    }

    // Logs the whole field to the console
    print() {
        for (let i = 0; i < this.field.length; i++) {
            console.log(this.field[i].join(' '));
        }
    }

    deleteStarting() {
        if(this.field[this.y][this.x] === pathCharacter) this.field[this.y][this.x] = fieldCharacter;
    }

    // Takes input value from previous function and returns changed current point based on given data
    move(direction, currentPoint) {
        switch (direction) {
            case 'd':
                currentPoint.y++;
                break;
            case 'u':
                currentPoint.y--;
                break;
            case 'l':
                currentPoint.x--;
                break;
            case 'r':
                currentPoint.x++;
                break;
            case 'q':
                currentPoint.exitMove = true;
                console.log('See you next time:)');
                break;
            case 'a':
                this.hardMode();
                break;

            default:
                console.log('Wrong direction! Try again!');
        }
        return currentPoint;
    };

    // Sets pathCharacter on the field of set coordinates, based on the conditions of the field
    changeField(currentPoint) {
        switch (this.field[currentPoint.y][currentPoint.x]) {
            case fieldCharacter:
                this.field[currentPoint.y][currentPoint.x] = pathCharacter;
                break;
            case hat:
                currentPoint.exitMove = true;
                console.log('Hooorayyyy! You won a game!')
                break;
            case hole:
                currentPoint.exitMove = true;
                console.log('Oops. You ended up in a hole:(');
                break;
        };
    }

    // Fills 20% of field with extra holes each step
    hardMode() {
        const fieldArea = this.field.length * this.field[0].length;

        const newHolesQuantity = generateRandomNumber((fieldArea / 5).toFixed());
        for (let i = 0; i <= newHolesQuantity; i++) {
            const tempY = generateRandomNumber(this.field.length - 1);
            const tempX = generateRandomNumber(this.field[0].length - 1);

            if (this.field[tempY][tempX] === fieldCharacter) {
                this.field[tempY][tempX] = hole;
            }

        }
    }

    checkValidity() {
        let startingPoint = {
            x: this.x,
            y: this.y,
        }

        let allPaths = [{
            direction: '',
            index: {
                x: startingPoint.x,
                y: startingPoint.y
            }
        }];

        let numberOfIterations = 0;

        // cd Desktop/coding/html-css-js/starting 

        while (allPaths.length > 0) {
            let tempLength = allPaths.length;

            numberOfIterations++;

            for (let i = 0; i < tempLength; i++) {
                this.field[allPaths[i].index.y][allPaths[i].index.x] = pathCharacter;
                const nextStep = {
                    left: {
                        x: allPaths[i].index.x - 1,
                        y: allPaths[i].index.y
                    },
                    right: {
                        x: allPaths[i].index.x + 1,
                        y: allPaths[i].index.y
                    },
                    top: {
                        x: allPaths[i].index.x,
                        y: allPaths[i].index.y - 1
                    },
                    bottom: {
                        x: allPaths[i].index.x,
                        y: allPaths[i].index.y + 1
                    }
                }

                if ((nextStep.left.x >= 0) && this.field[nextStep.left.y][nextStep.left.x] === hat ||
                    (nextStep.right.x < this.field[0].length) && (this.field[nextStep.right.y][nextStep.right.x] === hat) ||
                    (nextStep.top.y >= 0) && (this.field[nextStep.top.y][nextStep.top.x] === hat) ||
                    (nextStep.bottom.y < this.field.length) && (this.field[nextStep.bottom.y][nextStep.bottom.x] === hat)
                ) {
                    // console.log(`Can be solved ${numberOfIterations} steps`);
                    this.cleanfield()
                    return true;
                }

                if ((nextStep.left.x >= 0) && (this.field[nextStep.left.y][nextStep.left.x] === fieldCharacter)) {
                    allPaths.push({
                        direction: 'left',
                        index: {
                            x: nextStep.left.x,
                            y: nextStep.left.y
                        }
                    });
                };
                if ((nextStep.right.x < this.field[0].length) && (this.field[nextStep.right.y][nextStep.right.x] === fieldCharacter)) {
                    allPaths.push({
                        direction: 'right',
                        index: {
                            x: nextStep.right.x,
                            y: nextStep.right.y
                        }
                    });
                };
                if ((nextStep.top.y >= 0) && (this.field[nextStep.top.y][nextStep.top.x] === fieldCharacter)) {
                    allPaths.push({
                        direction: 'top',
                        index: {
                            x: nextStep.top.x,
                            y: nextStep.top.y
                        }
                    });
                };
                if ((nextStep.bottom.y < this.field.length) && (this.field[nextStep.bottom.y][nextStep.bottom.x] === fieldCharacter)) {
                    allPaths.push({
                        direction: 'bottom',
                        index: {
                            x: nextStep.bottom.x,
                            y: nextStep.bottom.y
                        }
                    });
                };
            }
            allPaths = allPaths.slice(tempLength);
            tempLength = 0;
        }
        this.cleanfield();
        return false;
    }

    cleanfield() {
        for (let i = 0; i < this.field.length; i++) {
            for (let j = 0; j < this.field[0].length; j++) {
                if (this.field[i][j] === pathCharacter && (i !== this.y || j !== this.x)) {
                    this.field[i][j] = fieldCharacter;
                }
            }
        }
    }

    // Generates new field with given height, width and holes percentage(in percents)
    static generateField(height, width, percentage) {
        let newField = [];
        const fieldArea = height * width;
        let holesQuantity = (fieldArea - 2) * percentage / 100;
        const hatPosition = {
            y: generateRandomNumber(height - 1),
            x: generateRandomNumber(width - 1)
        }

        for (let i = 0; i < height; i++) {
            newField[i] = [];
            for (let j = 0; j < width; j++) {
                newField[i][j] = fieldCharacter;
            }
        };

        settingHoles: while (holesQuantity > 0) {
            for (let i = 0; i < newField.length; i++) {
                for (let j = 0; j < newField[i].length; j++) {
                    if ((generateRandomNumber(1) === 1) && (holesQuantity > 0)) {
                        newField[i][j] = hole;
                        holesQuantity--;
                    }
                    if (holesQuantity === 0) {
                        break settingHoles;
                    }
                }
            }
        };

        newField[hatPosition.y][hatPosition.x] = hat;

        return newField;
    }

}

const myField = new Field(Field.generateField(10, 10, 20));

myField.play()