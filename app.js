// Todo List Item Model
const TodoItemModel = Backbone.Model.extend({
  defaults: {
    description: '',
    completed: false
  },
  toggle() {
    const isCompleted = !this.get('completed');
    this.set({completed: isCompleted});
    
    return isCompleted;
  }
});

// Todo List Collection
const TodoListCollection = Backbone.Collection.extend({
  model: TodoItemModel
});

// Todo Item View
const TodoItemView = Marionette.ItemView.extend({
  template: Handlebars.compile($('#todo-item-template').html()),
  tagName: 'li',
  className() {
    return this.model.get('completed') ? 'completed' : '';
  },
  ui: {
    checkbox: ':checkbox',
    removeBtn: '.remove'
  },
  events: {
    'click @ui.checkbox': 'toggle',
    'click @ui.removeBtn': 'delete'
  },
  toggle() {
    this.model.toggle();
  },
  delete() {
    this.model.destroy();
  },
  modelEvents: {
    'change': 'render'
  }
});

// Todo List View
const TodoListView = Marionette.CollectionView.extend({
  childView: TodoItemView,
  tagName: 'ul',
  collectionEvents: {
    'change': 'render'
  }
});

// Todo Form View
const TodoFormView = Marionette.ItemView.extend({
  template: Handlebars.compile($('#todo-form-template').html()),
  events: {
    'submit form': 'onFormSubmit'
  },
  onFormSubmit(e) {
    e.preventDefault();
    const $input = this.$('#new-todo');
    this.collection.add(new TodoItemModel({ description: $input.val() }));
    $input.val('');
  }
});

// Summary View
const SummaryView = Marionette.ItemView.extend({
  template: Handlebars.compile($('#todo-summary-template').html()),
  collectionEvents: {
    'all': 'render'
  },
  templateHelpers() {
    return {
      total: this.collection.length,
      completed: this.collection.where({ completed: true }).length
    };
  }
});

// Todo App Layout
const TodoApp = Marionette.LayoutView.extend({
  el: '#todo-app',
  template: _.template(`
    <div id="form-region"></div>
    <div id="list-region"></div>
    <div id="summary-region"></div>`),
  regions: {
    form: '#form-region',
    list: '#list-region',
    summary: '#summary-region'
  },
  onRender() {
    this.getRegion('form').show(new TodoFormView({ collection: this.collection }));
    this.getRegion('list').show(new TodoListView({ collection: this.collection }));
    this.getRegion('summary').show(new SummaryView({ collection: this.collection }));
  }
});

// Instantiate the todo list and the todo app
const todos = new TodoListCollection();
const app = new TodoApp({ collection: todos });

// Render the app
app.render();
