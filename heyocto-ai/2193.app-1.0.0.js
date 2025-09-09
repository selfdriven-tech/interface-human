
$(function()
{
  
	if (window.location.protocol == 'http:')
	{
		window.location.href = window.location.href.replace('http', 'https')
	}
	else
	{	
        $('.smoothscroll').on('click', function (e) {
            var target = this.hash,
            $target    = $(target);
            
                e.preventDefault();
                e.stopPropagation();

            $('html, body').stop().animate({
                'scrollTop': $target.offset().top
            }, 800, 'swing').promise().done(function () {

                window.location.hash = target;
            });
        });

        var uriContext = window.location.pathname;

       if (_.includes(uriContext, '/research'))
       {
            var uriContextData = _.replace(uriContext, '/research/', '');

            if (uriContextData != '')
            {
                if ($('#' + uriContextData + '-tab').length != 0)
                {
                    $('#' + uriContextData + '-tab').tab('show');
                }
            }
       }
    }
});