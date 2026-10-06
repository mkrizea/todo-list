import { useRef, useState, useSyncExternalStore } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ChecklistRoundedIcon from "@mui/icons-material/ChecklistRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useTodoStore } from "./store/todos.js";

const filters = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "done", label: "Done" },
];

export default function App() {
  const items = useTodoStore((state) => state.items);
  const addItem = useTodoStore((state) => state.addItem);
  const toggleItem = useTodoStore((state) => state.toggleItem);
  const updateItem = useTodoStore((state) => state.updateItem);
  const removeItem = useTodoStore((state) => state.removeItem);
  const restoreItem = useTodoStore((state) => state.restoreItem);
  const clearCompleted = useTodoStore((state) => state.clearCompleted);

  const ready = useSyncExternalStore(
    (onStoreChange) => useTodoStore.persist.onFinishHydration(onStoreChange),
    () => useTodoStore.persist.hasHydrated(),
    () => false,
  );
  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [undo, setUndo] = useState(null);
  const inputRef = useRef(null);

  const completed = items.filter((item) => item.done).length;
  const remaining = items.length - completed;
  const progress = items.length === 0 ? 0 : (completed / items.length) * 100;
  const visible = items.filter((item) => {
    if (filter === "active") return !item.done;
    if (filter === "done") return item.done;
    return true;
  });

  const handleAdd = () => {
    if (!draft.trim()) return;
    addItem(draft);
    setDraft("");
    inputRef.current?.focus();
  };

  const handleDelete = (id) => {
    const removed = removeItem(id);
    if (removed) setUndo(removed);
  };

  const handleUndo = () => {
    if (!undo) return;
    restoreItem(undo);
    setUndo(null);
  };

  const openEdit = (item) => {
    setEditing(item);
    setEditValue(item.value);
  };

  const closeEdit = () => {
    setEditing(null);
    setEditValue("");
  };

  const handleSave = () => {
    if (!editing) return;
    if (updateItem(editing.id, editValue)) closeEdit();
  };

  const emptyMessage =
    items.length === 0
      ? "Your list is empty. Add a task to get started."
      : filter === "active"
        ? "No open tasks."
        : "No completed tasks yet.";

  return (
    <Box
      sx={{
        height: "100dvh",
        boxSizing: "border-box",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: { xs: 2, sm: 3 },
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          maxHeight: "100%",
          minHeight: 0,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3.5 },
            border: 1,
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            maxHeight: "100%",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <Stack spacing={2.5} sx={{ minHeight: 0, overflow: "hidden" }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", flexShrink: 0 }}>
              <ChecklistRoundedIcon color="primary" sx={{ fontSize: 36 }} />
              <Typography variant="h1">Todo list</Typography>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start", flexShrink: 0 }}>
              <TextField
                inputRef={inputRef}
                fullWidth
                label="Add a task"
                placeholder="What needs doing?"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleAdd();
                  }
                }}
              />
              <Button
                variant="contained"
                size="large"
                disabled={!draft.trim()}
                onClick={handleAdd}
                sx={{ height: 56, px: 3 }}
              >
                Add
              </Button>
            </Stack>

            <Stack spacing={1} sx={{ flexShrink: 0 }}>
              <Stack
                direction="row"
                sx={{ alignItems: "center", justifyContent: "space-between", height: 30 }}
              >
                <Typography variant="body2" color="text.secondary">
                  {items.length === 0
                    ? "Nothing to do yet"
                    : remaining === 0
                      ? "All caught up"
                      : `${remaining} left · ${completed} done`}
                </Typography>
                {completed > 0 && (
                  <Button size="small" color="inherit" onClick={clearCompleted} >
                    Clear completed
                  </Button>
                )}
              </Stack>
              <LinearProgress
                variant="determinate"
                value={ready ? progress : 0}
                aria-label="Completion"
                sx={{
                  height: 8,
                  borderRadius: 99,
                  mt:8,
                  bgcolor: "action.hover",
                  "& .MuiLinearProgress-bar": { borderRadius: 99 },
                }}
              />
            </Stack>

            <ToggleButtonGroup
              exclusive
              fullWidth
              size="small"
              value={filter}
              onChange={(_, value) => {
                if (value) setFilter(value);
              }}
              aria-label="Filter tasks"
              sx={{ flexShrink: 0 }}
            >
              {filters.map((option) => (
                <ToggleButton key={option.value} value={option.value}>
                  {option.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            {!ready ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
                Loading your tasks…
              </Typography>
            ) : visible.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
                {emptyMessage}
              </Typography>
            ) : (
              <List
                disablePadding
                sx={{
                  minHeight: 0,
                  overflowY: "auto",
                }}
              >
                {visible.map((item) => (
                  <ListItem
                    key={item.id}
                    disablePadding
                    secondaryAction={
                      <Stack direction="row">
                        <Tooltip title="Edit">
                          <IconButton
                            aria-label={`Edit ${item.value}`}
                            onClick={() => openEdit(item)}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            edge="end"
                            aria-label={`Delete ${item.value}`}
                            onClick={() => handleDelete(item.id)}
                          >
                            <DeleteOutlineRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    }
                    sx={{
                      mb: 0.5,
                      borderRadius: 2,
                      bgcolor: item.done ? "action.hover" : "transparent",
                    }}
                  >
                    <ListItemButton onClick={() => toggleItem(item.id)} sx={{ borderRadius: 2, pr: 12 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Checkbox
                          edge="start"
                          checked={item.done}
                          tabIndex={-1}
                          disableRipple
                          slotProps={{
                            input: {
                              "aria-label": item.done
                                ? `Mark ${item.value} as not done`
                                : `Mark ${item.value} as done`,
                            },
                          }}
                          onClick={(event) => event.stopPropagation()}
                          onChange={() => toggleItem(item.id)}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.value}
                        sx={{
                          "& .MuiListItemText-primary": {
                            textDecoration: item.done ? "line-through" : "none",
                            color: item.done ? "text.secondary" : "text.primary",
                            overflowWrap: "anywhere",
                          },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Stack>
        </Paper>
      </Container>

      <Dialog open={Boolean(editing)} onClose={closeEdit} fullWidth maxWidth="xs">
        <DialogTitle>Edit task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Task"
            value={editValue}
            onChange={(event) => setEditValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSave();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEdit}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={!editValue.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(undo)}
        autoHideDuration={4000}
        onClose={(_, reason) => {
          if (reason === "clickaway") return;
          setUndo(null);
        }}
        message="Task deleted"
        action={
          <Button color="inherit" size="small" onClick={handleUndo}>
            Undo
          </Button>
        }
      />
    </Box>
  );
}
