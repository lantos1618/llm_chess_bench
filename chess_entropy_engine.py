import chess
import chess.engine
import time
import pandas as pd
import multiprocessing

class ChessAnalyzer:
    def __init__(self, stockfish_path="stockfish"):
        """Initialize the chess analyzer with path to Stockfish engine."""
        self.engine = chess.engine.SimpleEngine.popen_uci(stockfish_path)
        # Set configuration to use all available CPU threads
        num_threads = multiprocessing.cpu_count()
        self.engine.configure({
            "Threads": num_threads,
            "Hash": 128 * num_threads  # Scale hash size with thread count
        })
        print(f"Configured Stockfish to use {num_threads} threads")
        
    def analyze_position(self, fen, depth=None, multipv=3, time_limit=None):
        """
        Analyze a chess position given in FEN notation.
        Args:
            fen: FEN string of the position
            depth: Maximum depth to search
            multipv: Number of variations to analyze
            time_limit: Optional time limit in seconds
        """
        try:
            board = chess.Board(fen)
        except ValueError as e:
            return f"Invalid FEN notation: {e}"
        
        # Create analysis parameters with optional time control
        limit = chess.engine.Limit(depth=depth, time=time_limit)
        
        # Start timing the analysis
        start_time = time.time()
        
        # Get analysis with MultiPV
        info = self.engine.analyse(
            board,
            limit,
            multipv=multipv,
            info=chess.engine.INFO_ALL
        )
        
        # Calculate total analysis time
        analysis_time = max(time.time() - start_time, 0.001)  # Avoid division by zero
        
        results = []
        for pv_info in info:
            if "pv" not in pv_info or "score" not in pv_info:
                continue
            
            pv = pv_info["pv"]
            if not pv:
                continue
            
            score = pv_info["score"].relative.score(mate_score=100000) / 100
            first_move = pv[0]
            board_copy = board.copy()
            move_san = board_copy.san(first_move)
            
            # Get move explanation based on piece movement and captures
            explanation = self._explain_move(board, first_move)
            
            # Make the move and analyze follow-up positions
            board_copy = board.copy()
            board_copy.push(first_move)
            
            # Start timing follow-up analysis
            follow_up_start = time.time()
            
            # Analyze follow-up position
            follow_up_info = self.engine.analyse(
                board_copy,
                chess.engine.Limit(depth=depth-2),
                multipv=multipv,
                info=chess.engine.INFO_ALL
            )
            
            # Calculate follow-up analysis time
            follow_up_time = max(time.time() - follow_up_start, 0.001)  # Avoid division by zero
            total_time = analysis_time + follow_up_time
            
            # Calculate standard deviation of follow-up scores
            follow_up_scores = []
            for follow_pv_info in follow_up_info:
                if "score" in follow_pv_info:
                    follow_score = follow_pv_info["score"].relative.score(mate_score=100000) / 100
                    follow_up_scores.append(follow_score)
            
            if follow_up_scores:
                mean = sum(follow_up_scores) / len(follow_up_scores)
                # Calculate how much positions deviate from the mean evaluation
                # Larger deviations indicate more tactical possibilities and volatile positions
                score_volatility = sum(abs(x - mean) for x in follow_up_scores) / len(follow_up_scores)
                
                # Calculate complexity/time ratio
                # Higher ratio means more complex position that can be analyzed quickly
                complexity_time_ratio = score_volatility / total_time
                
                # Use the complexity/time ratio to adjust the score
                # Scaling factor determines how much the ratio affects the final score
                scaling_factor = 1.0  # Adjust this to control the impact
                adjusted_score = score + (complexity_time_ratio * scaling_factor)
            else:
                adjusted_score = score
                score_volatility = 0
                complexity_time_ratio = 0
            
            results.append((adjusted_score, move_san, score, score_volatility, complexity_time_ratio, total_time, explanation))
        
        results.sort(key=lambda x: x[0], reverse=True)
        return results

    def _explain_move(self, board, move):
        """Generate a natural language explanation for a move."""
        piece = board.piece_at(move.from_square)
        if not piece:
            return ""
        
        piece_name = chess.piece_name(piece.piece_type).capitalize()
        from_square = chess.square_name(move.from_square)
        to_square = chess.square_name(move.to_square)
        
        explanation = f"{piece_name} moves from {from_square} to {to_square}"
        
        # Add capture information
        if board.is_capture(move):
            captured_piece = board.piece_at(move.to_square)
            if captured_piece:
                captured_name = chess.piece_name(captured_piece.piece_type)
                explanation += f", capturing {captured_name}"
        
        # Add check/mate information
        board_copy = board.copy()
        board_copy.push(move)
        if board_copy.is_checkmate():
            explanation += " (Checkmate!)"
        elif board_copy.is_check():
            explanation += " (Check)"
        
        return explanation

    def visualize_position(self, fen):
        """Return ASCII representation of the board position."""
        try:
            board = chess.Board(fen)
            return str(board)
        except ValueError as e:
            return f"Invalid FEN notation: {e}"

    def analyze_user_position(self, fen=None, depth=20, num_moves=10, time_limit=None):
        """
        Analyze a user-provided position with improved output using pandas DataFrame.
        """
        if fen is None:
            print("\nEnter FEN string (or press Enter for starting position):")
            fen = input().strip()
            if not fen:
                fen = chess.STARTING_FEN
        
        if len(fen.split()) < 6:
            fen = fen + " 0 1"
        
        try:
            # Show the board position
            print("\nCurrent Position:")
            print("================")
            print(self.visualize_position(fen))
            print("================")
            
            results = self.analyze_position(fen, depth=depth, multipv=num_moves, time_limit=time_limit)
            if not results:
                print("No legal moves found in this position.")
                return
            
            print(f"\nAnalysis (Depth {depth}, showing top {num_moves} moves):")
            print("=" * 60)
            
            # Create pandas DataFrame
            df = pd.DataFrame(results, columns=[
                'Adjusted Score',
                'Move',
                'Base Score',
                'Volatility',
                'C/T Ratio',
                'Time (s)',
                'Explanation'
            ])
            
            # Format the numeric columns
            df['Base Score'] = df['Base Score'].apply(self._format_score)
            df['Adjusted Score'] = df['Adjusted Score'].apply(self._format_score)
            df['Volatility'] = df['Volatility'].round(2)
            df['C/T Ratio'] = df['C/T Ratio'].round(3)
            df['Time (s)'] = df['Time (s)'].round(3)
            
            # Add move numbers
            df.index = range(1, len(df) + 1)
            
            # Set display options for better formatting
            pd.set_option('display.max_columns', None)
            pd.set_option('display.width', None)
            pd.set_option('display.max_colwidth', None)
            
            # Display the DataFrame
            print(df.to_string())
            
            return results
            
        except ValueError as e:
            print(f"Error: Invalid FEN notation - {e}")
        except Exception as e:
            print(f"Error during analysis: {e}")

    def _format_score(self, score):
        """Format evaluation scores nicely."""
        if abs(score) > 100:
            return f"M{int(abs(score))}" if score > 0 else f"-M{int(abs(score))}"
        return f"{score:+.2f}"

    def close(self):
        """Close the engine properly."""
        self.engine.quit()

    def count_material(self, board, color):
        """
        Count material value for a given color.
        """
        piece_values = {
            chess.PAWN: 1,
            chess.KNIGHT: 3,
            chess.BISHOP: 3,
            chess.ROOK: 5,
            chess.QUEEN: 9,
            chess.KING: 0  # Don't count the king
        }
        
        total = 0
        for square in chess.SQUARES:
            piece = board.piece_at(square)
            if piece and piece.color == color:
                total += piece_values.get(piece.piece_type, 0)
        return total

def main():
    try:
        # On macOS, Stockfish is usually installed here when using Homebrew
        alternative_paths = [
            "stockfish",
            "/usr/local/bin/stockfish",
            "/opt/homebrew/bin/stockfish",
            "/usr/games/stockfish"  # Added Linux path
        ]
        
        # Try to find Stockfish
        for path in alternative_paths:
            try:
                analyzer = ChessAnalyzer(path)
                print(f"Successfully connected to Stockfish at: {path}")
                break
            except FileNotFoundError:
                continue
        else:
            print("Error: Stockfish not found. Please install Stockfish and provide the correct path.")
            print("You can install it using: brew install stockfish")
            return

        while True:
            # Analyze user position
            analyzer.analyze_user_position(depth=20, num_moves=10)
            
            # Ask if user wants to analyze another position
            print("\nAnalyze another position? (y/n):")
            if input().lower() != 'y':
                break
            
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        try:
            analyzer.close()
        except UnboundLocalError:
            pass

if __name__ == "__main__":
    main() 