const SEARCH_DEPTH = 1;
const CAPTURE_DEPTH = 0;

function minimaxRoot(depth, game, isMaximisingPlayer) {
    var moves = game.moves({ verbose: true });
    // var newGameMoves = optimalSort(moves);
    var newGameMove = moves;

    var bestMove = -9999;
    var bestMoveFound;

    for(var i = 0; i < newGameMoves.length; i++) {
        var newGameMove = newGameMoves[i];
        game.move(newGameMove);
        var value = minimax(depth - 1, game, -10000, 10000, !isMaximisingPlayer);
        game.undo();
        if(value >= bestMove) {
            bestMove = value;
            bestMoveFound = newGameMove;
        }
    }
    console.log("Score: ",-bestMove/10, depth);
    return bestMoveFound;
};



function minimax(depth, game, alpha, beta, isMaximisingPlayer) {
    positionCount++;
    if (depth === 0) {
        return -evaluateBoard(game);
    }
    var moves = game.moves({ verbose: true });
    var newGameMoves;
    // if (depth <= CAPTURE_DEPTH) {
    //   newGameMoves = onlyCaptureMoves(moves);
    //   if (newGameMoves.length === 0)
    //     return -evaluateBoard(game);
    // } else {
    //   newGameMoves = optimalSort(moves);
    // }
    newGameMoves = moves;

    if (isMaximisingPlayer) {
        var bestMove = -9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.move(newGameMoves[i]);
            bestMove = Math.max(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
            game.undo();
            alpha = Math.max(alpha, bestMove);
            if (beta <= alpha) {
                return bestMove;
            }
        }
        return bestMove;
    } else {
        var bestMove = 9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.move(newGameMoves[i]);
            bestMove = Math.min(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
            game.undo();
            beta = Math.min(beta, bestMove);
            if (beta <= alpha) {
                return bestMove;
            }
        }
        return bestMove;
    }
};

function optimalSort(moves) {
  var res = [];
  for (var i = 0; i<moves.length;i++){
    var move = moves[i];
    if (move['flag'] == undefined) {
      console.log('w')
      res.push(move);
    } else if ((move['flag'].indexOf('c') > -1) || (move['flag'].indexOf('e') > -1)) {
      res.unshift(move);
    } else {
      res.push(move);
    }
  }
  return res;
}

function onlyCaptureMoves(moves) {
  var res = [];
  for (var i = 0; i<moves.length;i++){
    var move = moves[i];
    console.log(move['flag']);
    if ((move['flag'] == 'c') || (move['flag'] == 'e')) {
      console.log('k');
      res.push(move);
    }
  }
  return res;
}

function evaluateBoard(game) {
    var totalEvaluation = 0;
    if (game.in_checkmate() === true)
      return 9999.0;
    if (game.in_draw() === true)
      return 0.0;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            totalEvaluation = totalEvaluation + getPieceValue(game.board()[i][j], i ,j, isEndGame(game.board()));
        }
    }
    return totalEvaluation;
};

function isEndGame(board){
  var pieces = 0;
  for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
          if (board[i][j] != null) pieces+=1;
      }
  }
  return (pieces < 10);
}

function reverseArray(array) {
    return array.slice().reverse();
};

var pawnEvalWhite =
    [
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
        [5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0],
        [1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0],
        [0.5,  0.5,  1.0,  2.7,  2.7,  1.0,  0.5,  0.5],
        [0.0,  0.0,  0.0,  2.5,  2.5,  0.0,  0.0,  0.0],
        [0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5],
        [0.5,  1.0, 1.0,  -2.5, -2.5,  1.0,  1.0,  0.5],
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
    ];

var pawnEvalBlack = reverseArray(pawnEvalWhite);

var knightEval =
    [
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
        [-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0],
        [-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0],
        [-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0],
        [-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0],
        [-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0],
        [-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0],
        [-5.0, -4.0, -2.0, -3.0, -3.0, -2.0, -4.0, -5.0]
    ];

var bishopEvalWhite = [
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
    [ -1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
    [ -1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
    [ -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
    [ -1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
    [ -2.0, -1.0, -4.0, -1.0, -1.0, -4.0, -1.0, -2.0]
];

var bishopEvalBlack = reverseArray(bishopEvalWhite);

var rookEvalWhite = [
    [  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
    [  0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [  0.0,   0.0, 0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
];

var rookEvalBlack = reverseArray(rookEvalWhite);

var evalQueen = [
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [  0.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [ -1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
];

var kingEvalWhite = [

    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [ -1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [  2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0],
    [  2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0]
];

var kingEvalBlack = reverseArray(kingEvalWhite);

var kingEvalWhiteEG = [
    [-5.0,-4.0,-3.0,-2.0,-2.0,-3.0,-4.0,-5.0],
    [-3.0,-2.0,-1.0, 0.0, 0.0,-1.0,-2.0,-3.0],
    [-3.0,-1.0, 2.0, 3.0, 3.0, 2.0,-1.0,-3.0],
    [-3.0,-1.0, 3.0, 4.0, 4.0, 3.0,-1.0,-3.0],
    [-3.0,-1.0, 3.0, 4.0, 4.0, 3.0,-1.0,-3.0],
    [-3.0,-1.0, 2.0, 3.0, 3.0, 2.0,-1.0,-3.0],
    [-3.0,-3.0, 0.0, 0.0, 0.0, 0.0,-3.0,-3.0],
    [-5.0,-3.0,-3.0,-3.0,-3.0,-3.0,-3.0,-5.0]
]

var kingEvalBlackEG = reverseArray(kingEvalWhiteEG);


function getPieceValue(piece, x, y, isEndGame) {
    if (piece === null) {
        return 0;
    }
    var getAbsoluteValue = function (piece, isWhite, x ,y) {
        if (piece.type === 'p') {
            return 10.0 + ( isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x] );
        } else if (piece.type === 'r') {
            return 50.0 + ( isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x] );
        } else if (piece.type === 'n') {
            return 32.0 + knightEval[y][x];
        } else if (piece.type === 'b') {
            return 32.5 + ( isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x] );
        } else if (piece.type === 'q') {
            return 97.5 + evalQueen[y][x];
        } else if (piece.type === 'k') {
            if (isEndGame === false) {
              return 900.0 + ( isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x] );
            } else {
              return 900.0 + ( isWhite ? kingEvalWhiteEG[y][x] : kingEvalBlackEG[y][x] );
            }
        }
        throw "Unknown piece type: " + piece.type;
    };

    var absoluteValue = getAbsoluteValue(piece, piece.color === 'w', x ,y);
    return piece.color === 'w' ? absoluteValue : -absoluteValue;
};

var positionCount;
function getBestMove(game) {
    positionCount = 0;
    var depth = SEARCH_DEPTH;

    var d = new Date().getTime();
    var bestMove = minimaxRoot(depth, game, true);
    var d2 = new Date().getTime();
    var moveTime = (d2 - d);
    var positionsPerS = ( positionCount * 1000 / moveTime);

    $('#position-count').text(positionCount);
    $('#time').text(moveTime/1000 + 's');
    $('#positions-per-s').text(positionsPerS);
    return bestMove;
};

// var renderMoveHistory = function (moves) {
//     var historyElement = $('#move-history').empty();
//     historyElement.empty();
//     for (var i = 0; i < moves.length; i = i + 2) {
//         historyElement.append('<span>' + moves[i] + ' ' + ( moves[i + 1] ? moves[i + 1] : ' ') + '</span><br>')
//     }
//     historyElement.scrollTop(historyElement[0].scrollHeight);
//
// };
