var app = {};
app._util = entityos._util;
app.invoke = app._util.controller.invoke;
app.add = app._util.controller.add;
app.view = app._util.view;
app.find = app._util.data.find;
app.set = app._util.data.set;
app.get = app._util.data.get;
app.refresh = app._util.view.refresh;
app.vq = app._util.view.queue;
app.show = app.vq.show;
app.whoami = entityos._util.whoami;

var objects =
{
	user: 22,
	contactPerson: 32,
	contactBusiness: 12,
	project: 1,
	product: 16,
	action: 17,
	event: 39,
	projectTask: 11,
	contactAttribute: 409,
	messagingConversation: 50
}

/*app.set(
{
	scope: 'util-setup',
	context: 'objects',
	value: objects
});*/

app.invoke('util-setup');