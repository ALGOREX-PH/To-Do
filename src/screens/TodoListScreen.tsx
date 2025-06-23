
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, LogOut, Edit3, Trash2, Check, X } from 'lucide-react-native';
import { useAuthStore } from '../stores/authStore';
import { useTodoStore } from '../stores/todoStore';
import { colors } from '../constants/colors';
import { Todo } from '../types';

export default function TodoListScreen() {
  const { user, signOut } = useAuthStore();
  const { todos, addTodo, updateTodo, deleteTodo, toggleTodo } = useTodoStore();
  
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const userTodos = todos.filter(todo => todo.userId === user?.id);
  const completedCount = userTodos.filter(todo => todo.completed).length;

  const handleAddTodo = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }
    await addTodo(title, description, priority);
    resetForm();
    setIsAddModalVisible(false);
  };

  const handleEditTodo = async () => {
    if (!editingTodo || !title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }
    await updateTodo(editingTodo.id, { title, description, priority });
    resetForm();
    setEditingTodo(null);
  };

  const handleDeleteTodo = (todo: Todo) => {
    Alert.alert(
      'Delete Todo',
      `Are you sure you want to delete "${todo.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTodo(todo.id) }
      ]
    );
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
  };

  const openEditModal = (todo: Todo) => {
    setEditingTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description || '');
    setPriority(todo.priority);
  };

  const closeModals = () => {
    setIsAddModalVisible(false);
    setEditingTodo(null);
    resetForm();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return colors.high;
      case 'medium': return colors.medium;
      case 'low': return colors.low;
      default: return colors.medium;
    }
  };

  const renderTodoItem = ({ item }: { item: Todo }) => (
    <View style={styles.todoItem}>
      <TouchableOpacity 
        style={styles.todoContent}
        onPress={() => toggleTodo(item.id)}
      >
        <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(item.priority) }]} />
        <View style={styles.todoText}>
          <Text style={[styles.todoTitle, item.completed && styles.completedText]}>
            {item.title}
          </Text>
          {item.description ? (
            <Text style={[styles.todoDescription, item.completed && styles.completedText]}>
              {item.description}
            </Text>
          ) : null}
        </View>
        <View style={[styles.checkbox, item.completed && styles.checkboxCompleted]}>
          {item.completed && <Check size={16} color="#FFFFFF" />}
        </View>
      </TouchableOpacity>
      
      <View style={styles.todoActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openEditModal(item)}
        >
          <Edit3 size={16} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteTodo(item)}
        >
          <Trash2 size={16} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name}!</Text>
          <Text style={styles.stats}>
            {userTodos.length} tasks • {completedCount} completed
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <LogOut size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={userTodos}
        renderItem={renderTodoItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.todoList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No todos yet</Text>
            <Text style={styles.emptyStateSubtext}>Tap the + button to add your first todo</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsAddModalVisible(true)}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Add/Edit Todo Modal */}
      <Modal
        visible={isAddModalVisible || editingTodo !== null}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModals}>
              <X size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingTodo ? 'Edit Todo' : 'Add Todo'}
            </Text>
            <TouchableOpacity
              onPress={editingTodo ? handleEditTodo : handleAddTodo}
            >
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.textInput}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter todo title"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter description (optional)"
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Priority</Text>
              <View style={styles.priorityButtons}>
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.priorityButton,
                      priority === p && styles.priorityButtonActive,
                      { borderColor: getPriorityColor(p) }
                    ]}
                    onPress={() => setPriority(p)}
                  >
                    <Text style={[
                      styles.priorityButtonText,
                      priority === p && { color: getPriorityColor(p) }
                    ]}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  stats: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  todoList: {
    padding: 16,
    paddingTop: 0,
  },
  todoItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  todoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  priorityIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  todoText: {
    flex: 1,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  todoDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  todoActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyStateText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textMuted,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  saveButton: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  priorityButtonActive: {
    backgroundColor: colors.card,
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
