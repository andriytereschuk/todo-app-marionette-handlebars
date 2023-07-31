// Todo Model
const Todo = Backbone.Model.extend({
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

// Todo Collection
const TodoList = Backbone.Collection.extend({
  model: Todo
});

// Todo Item View
const TodoView = Marionette.View.extend({
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
    'click @ui.removeBtn': 'remove'
  },
  toggle: function() {
    this.model.toggle();
  },
  remove() {
    this.model.destroy();
  },
  modelEvents: {
    'change': 'render'
  }
});

// Todo List View
const TodoListView = Marionette.CollectionView.extend({
  childView: TodoView,
  tagName: 'ul',
  collectionEvents: {
    'change': 'render'
  }
});

// Todo Form View
const TodoFormView = Marionette.View.extend({
  template: Handlebars.compile($('#todo-form-template').html()),
  events: {
    'submit form': 'onFormSubmit'
  },
  onFormSubmit(e) {
    e.preventDefault();
    const $input = this.$('#new-todo');
    this.collection.add({ description: $input.val() });
    $input.val('');
  }
});

// Summary View
const SummaryView = Marionette.View.extend({
  template: Handlebars.compile($('#todo-summary-template').html()),
  collectionEvents: {
    'all': 'render'
  },
  templateContext() {
    return {
      total: this.collection.length,
      completed: this.collection.where({ completed: true }).length
    };
  }
});

// Todo App Layout
const TodoApp = Marionette.View.extend({
  el: '#todo-app',
  template: _.template('<div id="form-region"></div><div id="list-region"></div><div id="summary-region"></div>'),
  regions: {
    form: '#form-region',
    list: '#list-region',
    summary: '#summary-region'
  },
  onRender() {
    this.showChildView('form', new TodoFormView({ collection: this.collection }));
    this.showChildView('list', new TodoListView({ collection: this.collection }));
    this.showChildView('summary', new SummaryView({ collection: this.collection }));
  }
});

// Instantiate the todo list and the todo app
const todos = new TodoList();
const app = new TodoApp({ collection: todos });

// Render the app
app.render();
