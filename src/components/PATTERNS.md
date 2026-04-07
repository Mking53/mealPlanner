# Component Patterns & Best Practices

This document provides guidelines on how to use the reusable abstraction components created during the refactoring effort.

---

## Table of Contents

1. [Modal Components](#modal-components)
2. [Form Components](#form-components)
3. [Card & Container Components](#card--container-components)
4. [List & Selection Components](#list--selection-components)
5. [Styling Components](#styling-components)
6. [Theme & Colors](#theme--colors)

---

## Modal Components

### ModalWrapper

**Purpose**: Standardized modal container with title, subtitle, and primary/secondary actions.

**When to use**:
- Add/Edit dialogs with 1-2 actions
- Confirmation modals
- Input forms that need modal presentation
- Simple single-select dialogs

**When NOT to use**:
- Complex multi-select modals (use SelectableListModal instead)
- Bottom sheets (consider PlannerGroupSelectorModal pattern)
- Modals with scrollable content and custom footer

**Basic Usage**:
```typescript
<ModalWrapper
  visible={isVisible}
  onClose={handleClose}
  title="Add Friend"
  subtitle="Enter your friend's email address"
  primaryAction={{
    label: 'Add',
    onPress: handleAdd,
    disabled: !isEmailValid,
  }}
  secondaryAction={{
    label: 'Cancel',
    onPress: handleClose,
  }}>
  <ValidatedInput
    label="Email"
    placeholder="friend@example.com"
    value={email}
    onChangeText={setEmail}
    isValid={isEmailValid}
    keyboardType="email-address"
  />
</ModalWrapper>
```

**Props**:
- `visible: boolean` - Show/hide modal
- `onClose: () => void` - Close handler
- `title: string` - Modal title
- `subtitle?: string` - Optional subtitle
- `primaryAction: ActionConfig` - Primary button config
- `secondaryAction?: ActionConfig` - Optional secondary button
- `animationType?: 'fade' | 'slide' | 'none'` - Animation type
- `children: ReactNode` - Modal content

**Common Patterns**:
- Use with ValidatedInput for single form fields
- Pair with SelectableListModal for selection modals
- Add custom footer View for multi-action modals

---

## Form Components

### ValidatedInput

**Purpose**: TextInput with built-in validation styling, error display, and helper text.

**When to use**:
- All text inputs in modals/forms
- Email, name, number inputs with validation
- Multi-field forms with consistent styling

**When NOT to use**:
- Complex custom input types (use raw TextInput)
- Picker/select inputs (use SelectableListModal)

**Basic Usage**:
```typescript
const [value, setValue] = useState('');
const isValid = value.length >= 3 && /^[a-zA-Z\s]*$/.test(value);

<ValidatedInput
  label="Item Name"
  placeholder="Enter item name"
  value={value}
  onChangeText={setValue}
  isValid={isValid}
  helperText="Min 3 characters, letters only"
  keyboardType="default"
  autoCapitalize="words"
/>
```

**Props**:
- `label: string` - Input label
- `placeholder: string` - Placeholder text
- `value: string` - Current value
- `onChangeText: (text: string) => void` - Change handler
- `isValid: boolean` - Validation state
- `helperText?: string` - Helper/error message
- `keyboardType?: KeyboardTypeOptions` - Keyboard type
- `autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'` - Capitalization

**Validation Patterns**:
```typescript
// Email validation
const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Number validation
const isCountValid = parseInt(count) > 0 && !isNaN(parseInt(count));

// String length validation
const isNameValid = name.trim().length >= 2 && name.trim().length <= 50;
```

---

## Card & Container Components

### CardWrapper

**Purpose**: Consistent card container with shadow, border-radius, and padding.

**When to use**:
- All card-like components (meal cards, grocery cards, settings rows)
- Components that need shadow/elevation and rounded corners
- Wrapping multiple elements in a unified card style

**When NOT to use**:
- Simple list items (use ActionableListItem)
- Modal content (use ModalWrapper)

**Basic Usage**:
```typescript
<CardWrapper>
  <Text style={styles.title}>{title}</Text>
  <Text style={styles.description}>{description}</Text>
</CardWrapper>
```

**Props**:
- `children: ReactNode` - Card content
- `style?: StyleProp<ViewStyle>` - Additional styles
- `noPadding?: boolean` - Remove default padding (optional)
- `noShadow?: boolean` - Remove shadow effect (optional)

**Common Patterns**:
```typescript
// Card with custom padding
<CardWrapper noPadding style={styles.customCard}>
  {/* Content with custom padding */}
</CardWrapper>

// Card without shadow (e.g., inside another card)
<CardWrapper noShadow>
  {/* Content */}
</CardWrapper>

// Pressable card
<Pressable onPress={handlePress} style={styles.pressableWrapper}>
  <CardWrapper>
    {/* Content */}
  </CardWrapper>
</Pressable>
```

### Avatar

**Purpose**: Reusable avatar with image or fallback initials.

**When to use**:
- User/profile avatars
- Meal images with fallback
- Any circular image with text fallback

**When NOT to use**:
- Non-circular images
- Icons (use MaterialIcons directly)

**Basic Usage**:
```typescript
<Avatar
  imageUri={user.photoUrl}
  initials={getInitials(user.name)}
  size="medium"
/>
```

**Props**:
- `imageUri?: string` - Image URL
- `initials: string` - Fallback text (e.g., "JD" for John Doe)
- `size: 'small' | 'medium' | 'large'` - Avatar size
- `onImageError?: () => void` - Error callback

**Size Reference**:
- `small`: 40x40 (badges, lists)
- `medium`: 64x64 (default, profile cards)
- `large`: 88x88 (hero sections, meal cards)

### EmptyState

**Purpose**: Consistent empty state display with optional icon.

**When to use**:
- List/collection empty states
- No results screens
- First-time user empty states

**Basic Usage**:
```typescript
{items.length === 0 ? (
  <EmptyState
    icon="shopping-cart"
    title="No Items Yet"
    description="Add your first grocery item to get started"
  />
) : (
  // List content
)}
```

**Props**:
- `title: string` - Empty state title
- `description?: string` - Optional description
- `icon?: MaterialIconName` - Optional icon
- `style?: StyleProp<ViewStyle>` - Additional styles

---

## List & Selection Components

### SelectableListModal

**Purpose**: Generic modal for selectable item lists with checkboxes or custom rendering.

**When to use**:
- Multi-select dialogs
- Large lists of selectable items
- Selection modals with scrollable content

**When NOT to use**:
- Simple single item dialogs (use ModalWrapper)
- Selection rows within other modals (use SelectableRow)

**Basic Usage**:
```typescript
interface Item extends SelectableItem {
  id: string;
  label: string;
}

<SelectableListModal<Item>
  visible={isVisible}
  onClose={handleClose}
  items={items}
  selectedIds={selectedIds}
  onToggle={handleToggle}
  title="Select Groups"
  subtitle="Choose groups to view"
  renderItem={(item, isSelected) => (
    <View>
      <Text>{item.label}</Text>
    </View>
  )}
  primaryAction={{
    label: 'Apply',
    onPress: handleApply,
  }}
/>
```

### SelectableRow

**Purpose**: Single selectable row with optional icon and checkbox.

**When to use**:
- Individual selectable items in lists
- Day/date selection rows
- Group/item selection within modals
- Simple select/deselect UI

**When NOT to use**:
- Complex row content (use ActionableListItem)
- Action buttons with rows (use ActionableListItem)

**Basic Usage**:
```typescript
<SelectableRow
  title="Monday, Jan 15"
  subtitle="12 meals planned"
  isSelected={selectedDate === 'jan-15'}
  onPress={() => setSelectedDate('jan-15')}
  leadingIcon="calendar"
/>
```

**Props**:
- `title: string` - Row title
- `subtitle?: string` - Optional subtitle
- `isSelected: boolean` - Selection state
- `onPress: () => void` - Selection handler
- `leadingIcon?: MaterialIconName` - Optional leading icon
- `trailingIcon?: MaterialIconName` - Optional trailing icon (overrides checkbox)
- `leadingIconColor?: string` - Icon color

### ActionableListItem

**Purpose**: List item with leading icon, content, and action buttons.

**When to use**:
- List items with edit/delete actions
- Grocery items with counts and edit buttons
- Any item row with multiple actions

**When NOT to use**:
- Simple selectable rows (use SelectableRow)
- Complex card layouts (use CardWrapper)

**Basic Usage**:
```typescript
<ActionableListItem
  title="Milk"
  subtitle="500ml • $3.99"
  leadingIcon="shopping-cart"
  isStrikethrough={isPurchased}
  actionButtons={[
    {
      icon: 'edit',
      onPress: handleEdit,
      accessibilityLabel: 'Edit item',
    },
    {
      icon: 'delete',
      onPress: handleDelete,
      accessibilityLabel: 'Delete item',
    },
  ]}
  onPress={handleTogglePurchase}
/>
```

**Props**:
- `title: string` - Item title
- `subtitle?: string` - Optional subtitle
- `leadingIcon?: MaterialIconName` - Optional leading icon
- `leadingIconColor?: string` - Icon color
- `actionButtons?: ActionButton[]` - Array of action button configs
- `isStrikethrough?: boolean` - Strikethrough style (for completed items)
- `onPress?: () => void` - Main row press handler

---

## Styling Components

### Chip

**Purpose**: Small tag component for categories, filters, or selections.

**When to use**:
- Category/tag display
- Filter pills
- Removable selections
- Multi-select chips

**When NOT to use**:
- Buttons (use Pressable or Button)
- Complex input fields (use ValidatedInput)

**Basic Usage**:
```typescript
// Outlined chip
<Chip text="Active" variant="outlined" isSelected={true} />

// Filled chip
<Chip text="Inactive" variant="filled" isSelected={false} />

// Removable chip
<Chip
  text="Item to remove"
  variant="removable"
  onRemove={handleRemove}
/>
```

**Props**:
- `text: string` - Chip text
- `variant?: 'outlined' | 'filled' | 'removable'` - Chip style
- `isSelected?: boolean` - Selection state
- `onRemove?: () => void` - Remove handler (for removable chips)
- `onPress?: () => void` - Press handler

**Variants**:
- **outlined**: Default style with border, updates color when selected
- **filled**: Solid background, changes color when selected
- **removable**: Includes close icon, typically for selected items display

---

## Theme & Colors

### Using COLORS from theme.ts

**Purpose**: Centralized color constants for consistent theming.

**Available Colors**:
```typescript
COLORS.primary               // #2f7d32 (main brand color)
COLORS.primaryLight          // #e7f4e5 (light variant)
COLORS.primaryDark           // #1b5e20 (dark variant)

COLORS.background            // #ffffff (white)
COLORS.backgroundLight       // #f8fbf7 (light gray)
COLORS.backgroundLighter     // #eef3ed (lighter gray)

COLORS.textPrimary           // #173222 (main text)
COLORS.textSecondary         // #5b6c61 (secondary text)
COLORS.textTertiary          // #7a8480 (tertiary text)
COLORS.textDisabled          // #9ca89f (disabled text)
COLORS.textInvert            // #ffffff (inverted text)

COLORS.success               // #2f7d32 (green)
COLORS.successDark           // #1b5e20 (dark green)

COLORS.error                 // #d32f2f (red)
COLORS.errorLight            // #ffcdd2 (light red)
COLORS.errorBackground       // #ffebee (error bg)

COLORS.warning               // #f57c00 (orange)

COLORS.border                // #dce8dd (border color)
COLORS.borderLight           // #eef3ed (light border)

COLORS.backdropText          // rgba(17, 24, 28, 0.42) (modal backdrop)
```

**Usage Pattern**:
```typescript
import { COLORS } from '../constants/theme';

const styles = StyleSheet.create({
  title: {
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  success: {
    color: COLORS.success,
  },
  border: {
    borderColor: COLORS.border,
  },
});
```

### Using CARD_STYLES from theme.ts

**Purpose**: Standardized card styling (shadows, border-radius, padding).

```typescript
CARD_STYLES.shadowColor         // '#16301c'
CARD_STYLES.shadowOpacity       // 0.08
CARD_STYLES.shadowOffset        // { width: 0, height: 10 }
CARD_STYLES.shadowRadius        // 18
CARD_STYLES.elevation           // 4 (Android)

CARD_STYLES.borderRadius        // 24
CARD_STYLES.padding             // 16
```

**Usage**:
- Most cards use CardWrapper which applies CARD_STYLES automatically
- Only override when creating custom card-like components

---

## Migration Guide

### From Old Pattern to New Pattern

**Modal Structure**:
```typescript
// OLD
<Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
  <Pressable style={styles.backdrop} onPress={onClose}>
    <Pressable style={styles.modalCard}>
      <Text style={styles.title}>{title}</Text>
      {/* buttons, content, etc */}
    </Pressable>
  </Pressable>
</Modal>

// NEW
<ModalWrapper
  visible={visible}
  onClose={onClose}
  title={title}
  primaryAction={{ label: 'Save', onPress: handleSave }}
  secondaryAction={{ label: 'Cancel', onPress: onClose }}>
  {/* content */}
</ModalWrapper>
```

**Text Input Validation**:
```typescript
// OLD
<TextInput
  value={value}
  onChangeText={setValue}
  style={[styles.input, !isValid && styles.inputError]}
/>
{!isValid && <Text style={styles.errorText}>{errorMsg}</Text>}

// NEW
<ValidatedInput
  label="Field"
  value={value}
  onChangeText={setValue}
  isValid={isValid}
  helperText={errorMsg}
/>
```

**Card Styling**:
```typescript
// OLD
<View style={styles.card}> {/* shadows, border-radius in StyleSheet */}
  {/* content */}
</View>

// NEW
<CardWrapper>
  {/* content */}
</CardWrapper>
```

---

## Accessibility Guidelines

### Modal Components
- Always provide `onRequestClose` callback
- Use meaningful button labels
- Ensure keyboard navigation works

### Form Components
- Use `label` prop for accessibility labels
- Provide `helperText` for validation assistance
- Use appropriate `keyboardType` for input type

### Interactive Elements
- Use `accessibilityRole` and `accessibilityLabel`
- Ensure sufficient touch targets (min 44x44 pt)
- Provide visual feedback on press

### Colors
- Don't rely solely on color difference
- Use text labels with colored elements
- Ensure sufficient contrast ratios (WCAG AA minimum)

---

## Performance Tips

1. **Use SelectableListModal for large lists** - Automatically optimizes rendering
2. **Memoize renderItem functions** - Prevent unnecessary re-renders
3. **Use StyleSheet.create()** - Styles are computed once
4. **Avoid inline object creation** - Create style objects once outside components
5. **Use CardWrapper for consistent styling** - Avoids shadow recalculation

---

## Common Patterns & Examples

### Edit Dialog with ValidatedInput
```typescript
function EditDialog({ isVisible, onClose, onSave, initialValue }) {
  const [value, setValue] = useState(initialValue);
  const isValid = value.trim().length > 0;

  return (
    <ModalWrapper
      visible={isVisible}
      onClose={onClose}
      title="Edit Item"
      primaryAction={{
        label: 'Save',
        onPress: () => onSave(value),
        disabled: !isValid,
      }}
      secondaryAction={{
        label: 'Cancel',
        onPress: onClose,
      }}>
      <ValidatedInput
        label="Item Name"
        value={value}
        onChangeText={setValue}
        isValid={isValid}
      />
    </ModalWrapper>
  );
}
```

### List with Actionable Items
```typescript
function GroceryList({ items, onEdit, onDelete }) {
  return (
    <CardWrapper>
      {items.map((item) => (
        <ActionableListItem
          key={item.id}
          title={item.name}
          subtitle={`${item.quantity} ${item.unit}`}
          leadingIcon="shopping-bag"
          actionButtons={[
            {
              icon: 'edit',
              onPress: () => onEdit(item),
            },
            {
              icon: 'delete',
              onPress: () => onDelete(item.id),
            },
          ]}
        />
      ))}
    </CardWrapper>
  );
}
```

### Selectable List
```typescript
function SelectGroupsDialog({ visible, groups, onClose, onSelect }) {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <SelectableListModal
      visible={visible}
      items={groups}
      selectedIds={selected}
      onToggle={(id) => {
        setSelected((prev) =>
          prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
      }}
      onClose={onClose}
      title="Select Groups"
      renderItem={(group, isSelected) => (
        <Text>{group.name}</Text>
      )}
      primaryAction={{
        label: 'Apply',
        onPress: () => {
          onSelect(selected);
          onClose();
        },
      }}
    />
  );
}
```

---

## Troubleshooting

**Q: Why is my CardWrapper padding too large?**
A: Use `noPadding` prop and add custom padding via style prop.

**Q: How do I customize ValidatedInput styling?**
A: ValidatedInput uses standardized styling from theme. For major customization, use raw TextInput.

**Q: Can I use SelectableListModal without checkboxes?**
A: Yes, use the `renderItem` prop to customize rendering with any indicator you want.

**Q: How do I make modals dismissible with back button on Android?**
A: All ModalWrapper instances support `onRequestClose` which handles Android back button.

---

## Conclusion

These components establish a consistent pattern library for the Meal Planner app. They standardize common UI patterns while remaining flexible enough for various use cases. Refer to this guide when building new screens or features to ensure consistency with existing components.
