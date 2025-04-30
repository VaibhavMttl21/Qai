import  {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  DragEvent,
  FormEvent,
  TouchEvent,
} from "react";
import { FiPlus, FiTrash } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaFire } from "react-icons/fa";
import api from "@/lib/api";

// API base URL - adjust if needed

// Todo interface to match backend model
interface TodoItem {
  id: string;
  description: string;
  completed: boolean;
  userId: string;
}

export const CustomKanban = () => {
  return (
    <div className="w-full text-neutral-500 overflow-x-scroll md:overflow-x-hidden">
      <Board />
    </div>
  );
};

const Board = () => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // For touch events on mobile
  const [activeTouchCard, setActiveTouchCard] = useState<CardType | null>(null);

  // Fetch todos from API on component mount
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/todo/gettodos');
        
        // Convert backend todos to frontend card format
        const todoCards = response.data.map((todo: TodoItem) => ({
          id: todo.id,
          title: todo.description,
          column: todo.completed ? "done" as ColumnType : "todo" as ColumnType,
        }));
        
        setCards(todoCards);
        setError(null); // Clear any previous error
      } catch (err) {
        console.error('Error fetching todos:', err);
        // setError('Failed to load tasks. Please try adding a new task.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchTodos();
  }, []);

  // Handle moving a card via touch on mobile
  const handleTouchEndOnBoard = (columnTo: ColumnType) => {
    if (activeTouchCard) {
      const cardToMove = { ...activeTouchCard };
      const previousColumn = cardToMove.column;
      
      if (previousColumn !== columnTo) {
        // Update card's column
        const updatedCards = cards.map(card => 
          card.id === cardToMove.id ? { ...card, column: columnTo } : card
        );
        
        // Update UI
        setCards(updatedCards);
        
        // Make API call to update status
        api.put(`/api/todo/updatetodo/${cardToMove.id}`, {
          completed: columnTo === "done"
        }).catch(err => {
          console.error('Failed to update todo status:', err);
          // Revert on error
          setCards(cards);
        });
      }
      
      // Reset active touch card
      setActiveTouchCard(null);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full gap-6 overflow-hidden px-4 py-6">
      {loading ? (
        <div>Loading tasks...</div>
      ) : (
        <>
          {error && (
            <div className="text-red-500 w-full mb-4">{error}</div>
          )}
          
          <Column
            title="TODO"
            column="todo"
            headingColor="text-yellow-400"
            cards={cards}
            setCards={setCards}
            showAddCard={true}
            activeTouchCard={activeTouchCard}
            setActiveTouchCard={setActiveTouchCard}
            onTouchEnd={() => handleTouchEndOnBoard("todo")}
          />
          <Column
            title="Complete"
            column="done"
            headingColor="text-emerald-400"
            cards={cards}
            setCards={setCards}
            showAddCard={false}
            activeTouchCard={activeTouchCard}
            setActiveTouchCard={setActiveTouchCard}
            onTouchEnd={() => handleTouchEndOnBoard("done")}
          />
          <BurnBarrel 
            setCards={setCards} 
            activeTouchCard={activeTouchCard}
            setActiveTouchCard={setActiveTouchCard}
          />
        </>
      )}
    </div>
  );
};

type ColumnProps = {
  title: string;
  headingColor: string;
  cards: CardType[];
  column: ColumnType;
  setCards: Dispatch<SetStateAction<CardType[]>>;
  showAddCard: boolean;
  activeTouchCard: CardType | null;
  setActiveTouchCard: Dispatch<SetStateAction<CardType | null>>;
  onTouchEnd: () => void;
};

const Column = ({
  title,
  headingColor,
  cards,
  column,
  setCards,
  showAddCard,
  activeTouchCard,
  setActiveTouchCard,
  onTouchEnd,
}: ColumnProps) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e: DragEvent, card: CardType) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragEnd = async (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];
      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;
      
      const previousColumn = cardToTransfer.column;
      cardToTransfer = { ...cardToTransfer, column };
      copy = copy.filter((c) => c.id !== cardId);

      const moveToBack = before === "-1";
      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;
        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      // Update state immediately for a responsive UI
      setCards(copy);
      
      // If the card is moved to a different column, update the completed status in the backend
      if (previousColumn !== column) {
        try {
          // Call API to update todo completion status
          await api.put(`/api/todo/updatetodo/${cardId}`, {
            completed: column === "done"
          });
        } catch (err) {
          console.error('Failed to update todo status:', err);
          // Revert the UI change on error
          setCards(prevCards => prevCards.map(c => 
            c.id === cardId ? { ...c, column: previousColumn } : c
          ));
        }
      }
    }
  };

  // ... existing drag and drop helper functions
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();
    indicators.forEach((i) => (i.style.opacity = "0"));
  };

  const highlightIndicator = (e: DragEvent) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
    const DISTANCE_OFFSET = 50;
    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );
    return el;
  };

  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll(`[data-column="${column}"]`) as unknown as HTMLElement[]
    );
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  // Handle touch end for the column
  const handleTouchEnd = () => {
    onTouchEnd();
  };

  const filteredCards = cards.filter((c) => c.column === column);

  return (
    <div 
      className="w-full sm:w-72 lg:w-60 shrink-0 mb-6 lg:mb-0"
      onTouchEnd={handleTouchEnd}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">{filteredCards.length}</span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${
          active || activeTouchCard ? "bg-neutral-200/50" : "bg-neutral-200/0"
        }`}
      >
        {filteredCards.map((c) => (
          <Card 
            key={c.id} 
            {...c} 
            handleDragStart={handleDragStart} 
            setActiveTouchCard={setActiveTouchCard}
          />
        ))}
        <DropIndicator beforeId={null} column={column} />
        
        {/* Fixed: Move the AddCard component inside the column's content area */}
        {showAddCard && <AddCard column={column} setCards={setCards} />}
      </div>
    </div>
  );
};

// ... existing Card component with touch support added
type CardProps = CardType & {
  handleDragStart: Function;
  setActiveTouchCard: Dispatch<SetStateAction<CardType | null>>;
};

const Card = ({ title, id, column, handleDragStart, setActiveTouchCard }: CardProps) => {
  const [touchStart, setTouchStart] = useState<{x: number, y: number} | null>(null);
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const longPressDelay = 500; // ms
  let longPressTimer: ReturnType<typeof setTimeout>;

  // Handle touch start for long press detection
  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY
    });
    
    // Start long press timer
    longPressTimer = setTimeout(() => {
      setLongPressTriggered(true);
      setActiveTouchCard({ title, id, column });
    }, longPressDelay);
  };

  // Cancel long press if moved
  const handleTouchMove = (e: TouchEvent) => {
    if (!touchStart) return;
    
    const touch = e.touches[0];
    const moveThreshold = 10; // pixels
    
    const deltaX = Math.abs(touch.clientX - touchStart.x);
    const deltaY = Math.abs(touch.clientY - touchStart.y);
    
    if (deltaX > moveThreshold || deltaY > moveThreshold) {
      // Movement detected, cancel long press
      clearTimeout(longPressTimer);
    }
  };

  // Clear timer when touch ends
  const handleTouchEnd = () => {
    clearTimeout(longPressTimer);
    setTouchStart(null);
    setLongPressTriggered(false);
  };

  const MotionDiv = motion.div as React.ComponentType<
        React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement>; layout?: boolean }
      >;

    
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <MotionDiv
        layout
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { title, id, column })}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`cursor-grab rounded border border-neutral-400 bg-purple-600 p-3 active:cursor-grabbing ${
          longPressTriggered ? 'opacity-50 scale-105' : ''
        }`}
      >
        <p className="text-sm text-neutral-100">{title}</p>
      </MotionDiv>
    </>
  );
};

type DropIndicatorProps = {
  beforeId: string | null;
  column: string;
};

const DropIndicator = ({ beforeId, column }: DropIndicatorProps) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-300 opacity-0"
    />
  );
};

const BurnBarrel = ({
  setCards,
  activeTouchCard,
  setActiveTouchCard
}: {
  setCards: Dispatch<SetStateAction<CardType[]>>;
  activeTouchCard: CardType | null;
  setActiveTouchCard: Dispatch<SetStateAction<CardType | null>>;
}) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = async (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");
    
    // Update UI immediately for responsiveness
    setCards((pv) => pv.filter((c) => c.id !== cardId));
    setActive(false);
    
    try {
      // Call API to delete todo
      await api.delete(`/api/todo/deletetodo/${cardId}`);
    } catch (err) {
      console.error('Failed to delete todo:', err);
      // You could restore the card if the API call fails
    }
  };

  // Handle touch end for deletion
  const handleTouchEnd = () => {
    if (activeTouchCard) {
      const cardId = activeTouchCard.id;
      
      // Update UI immediately
      setCards((pv) => pv.filter((c) => c.id !== cardId));
      
      // Reset active touch card
      setActiveTouchCard(null);
      
      // API call to delete
      api.delete(`/api/todo/deletetodo/${cardId}`).catch(err => {
        console.error('Failed to delete todo:', err);
      });
    }
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onTouchEnd={handleTouchEnd}
      className={`mt-6 lg:mt-10 h-44 w-full sm:w-60 shrink-0 rounded border text-3xl flex items-center justify-center text-center transition-colors ${
        active || activeTouchCard
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-400 bg-purple-200 text-neutral-500"
      }`}
    >
      {active || activeTouchCard ? <FaFire className="animate-bounce" /> : <FiTrash />}
    </div>
  );
};

type AddCardProps = {
  column: ColumnType;
  setCards: Dispatch<SetStateAction<CardType[]>>;
};

const MotionButton = motion.button as React.ComponentType<
React.ButtonHTMLAttributes<HTMLButtonElement> & { ref?: React.Ref<HTMLButtonElement>; layout?: boolean }
>;

const MotionForm = motion.form as React.ComponentType<
  React.FormHTMLAttributes<HTMLFormElement> & { ref?: React.Ref<HTMLFormElement>; layout?: boolean }
>;
const AddCard = ({  setCards }: AddCardProps) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim().length) return;
    
    setIsSubmitting(true);
    
    try {
      // Call API to create a new todo
      const response = await api.post(`/api/todo/addtodo`, {
        description: text.trim()
      });
      
      // Create a new card with the data returned from the API
      const newCard: CardType = {
        id: response.data.id,
        title: response.data.description,
        column: "todo", // New todos always start in the todo column
      };
      
      // Update the UI with the new card
      setCards((pv) => [...pv, newCard]);
      setText("");
      setAdding(false);
    } catch (err) {
      console.error('Failed to add todo:', err);
      // Handle error here (could show an error message)
    } finally {
      setIsSubmitting(false);
    }
  };

  return adding ? (
    <MotionForm layout onSubmit={handleSubmit}>
      <textarea
        onChange={(e) => setText(e.target.value)}
        autoFocus
        placeholder="Add new task..."
        className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-500 placeholder-violet-300 focus:outline-0"
      />
      <div className="mt-1.5 flex items-center justify-end gap-1.5">
        <button
          type="button"
          onClick={() => setAdding(false)}
          className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-600"
          disabled={isSubmitting}
        >
          Close
        </button>
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
          disabled={isSubmitting || !text.trim()}
        >
          <span>{isSubmitting ? 'Adding...' : 'Add'}</span>
          {!isSubmitting && <FiPlus />}
        </button>
      </div>
    </MotionForm>
  ) : (
    <MotionButton
      layout
      onClick={() => setAdding(true)}
      className="flex w-full items-center justify-center gap-1.5 rounded-md bg-purple-100 hover:bg-purple-200 p-2 mt-3 text-sm text-purple-700 transition-colors"
    >
      <FiPlus className="text-lg" />
      <span className="font-medium">Add task</span>
    </MotionButton>
  );
};

type ColumnType = "backlog" | "todo" | "doing" | "done";

type CardType = {
  title: string;
  id: string;
  column: ColumnType;
};

// We no longer need DEFAULT_CARDS since we're fetching from the API