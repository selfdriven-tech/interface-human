/*
	{
    	title: "Level Up; Skills"
  	}
*/

app.add(
{
	name: 'level-up-explorer-skills',
	code: function ()
    {
        $.ajax(
        {
            type: 'GET',
            url: '/site/2098/selfdriven-skills-domains.json',
            dataType: 'json',
            success: function(data)
            {
                var skillsDomainsView = app.vq.init({queue: 'skills-domains-view'});

                var domains = data.selfdriven.skills.domains;
                domains = _.sortBy(domains, 'name');

                skillsDomainsView.add([
                    '<div class="row border-bottom border-gray-300 pb-2 mb-1">',
                    '<div class="col-12 text-muted small mb-1">Leave unticked for all.</div>',
                    '</div>'
                ]);

                _.each(domains, function (domain)
                {
                    skillsDomainsView.add(
                    [
                        '<div class="row">',
                        '<div class="col-2 text-center"><input type="checkbox" class="entityos-check" data-scope="explorer-skills" data-context="domain" data-id="', domain.name, '"></div>',
                        '<div class="col-10">', domain.name, '</div>',
                        '</div>'
                    ]);
                });

                skillsDomainsView.render('#explorer-skills-search-domain');
            },
            error: function (data) {}			
        });

        $.ajax(
        {
            type: 'GET',
            url: '/site/2098/selfdriven-skills-sources.json',
            dataType: 'json',
            success: function(data)
            {
                var skillsSourcesView = app.vq.init({queue: 'skills-sources-view'});

                var sources = data.selfdriven.skills.sources;
                sources = _.sortBy(sources, 'name');

                skillsSourcesView.add(
                [
                    '<li class="border-bottom border-gray-300 pb-2 mb-2"><a class="dropdown-item entityos-dropdown" data-id="-1">All</a></li>'
                ]);

                _.each(sources, function (source)
                {
                    skillsSourcesView.add(
                    [
                        '<li class="mb-1"><a class="dropdown-item entityos-dropdown" data-id="', source.name,'">', source.name, '</a></li>',
                    ]);
                });

                skillsSourcesView.render('#explorer-skills-search-source');
            },
            error: function (data) {}			
        });

        $.ajax(
        {
            type: 'GET',
            url: '/site/2098/selfdriven-skills-levels.json',
            dataType: 'json',
            success: function(data)
            {
                var skillsLevelsView = app.vq.init({queue: 'skills-levels-view'});

                skillsLevelsView.add(
                [
                    '<li class="border-bottom border-gray-300 pb-2 mb-2"><a class="dropdown-item entityos-dropdown" data-id="-1">All</a></li>'
                ]);

                var levels = data.selfdriven.skills.levels;

                app.set({scope: 'explorer-skills', context: 'skills-levels', value: levels});

                _.each(levels, function (level)
                {
                    level._name = '<a class="dropdown-item entityos-dropdown" data-id="' + level.name + '">' + _.replace(level.name, 'Level ', '') + '</a>';

                    if (_.first(level.notes.usage) != '')
                    {
                        level._name = '<div class="col-3 text-center fw-bold">' + level._name + '</div><div class="col-9 text-wrap text-muted">' + _.first(level.notes.usage) + '</div>';
                    }
                    else
                    {
                        level._name = '<div class="col-3 text-center fw-bold">' + level._name + '</div><div class="col-9">-</div>'
                    }

                    skillsLevelsView.add(
                    [
                        '<li class="mb-1">',
                            '<div class="row">', level._name, '</div>',
                        '</a></li>',
                    ]);
                });

                skillsLevelsView.render('#explorer-skills-search-level');
            },
            error: function (data) {}			
        });

        $.ajax(
        {
            type: 'GET',
            url: '/site/2098/selfdriven-skills-capacities-1.0.0.json',
            dataType: 'json',
            success: function(data)
            {
                var skillsCapacitiesView = app.vq.init({queue: 'skills-capacities-view'});

                var capacities = data.selfdriven.skills.capacities;
                capacities = _.sortBy(capacities, 'name');

                skillsCapacitiesView.add(
                [
                    '<li class="border-bottom border-gray-300 pb-2 mb-2"><a class="dropdown-item entityos-dropdown" data-id="-1">All</a></li>'
                ]);

                _.each(capacities, function (capacity)
                {
                    skillsCapacitiesView.add(
                    [
                        '<li class="mb-1"><a class="dropdown-item entityos-dropdown" data-id="', _.first(capacity.name),'">', capacity.name, '</a></li>',
                    ]);
                });

                skillsCapacitiesView.render('#explorer-skills-search-capacity');
            },
            error: function (data) {}			
        });
    }
});

app.add(
{
    name: 'explorer-skills-search',
    code: function ()
    {
        var skillsSet = app.get({scope: 'explorer-skills', context: 'skills-set'});

        if (skillsSet != undefined)
        {
            app.invoke('explorer-skills-search-process');
        }
        else
        {
            app.show('#explorer-skills-search-view', '<h3 class="text-muted text-center mt-6">Initialising skills set ...</h3>');

            $.ajax(
            {
                type: 'GET',
                url: '/site/2098/selfdriven-skills-set-1.0.0.json',
                dataType: 'json',
                success: function(data)
                {
                    app.set({scope: 'explorer-skills', context: 'skills-set', value: data.selfdriven.skills.set});
                    app.invoke('explorer-skills-search-process');
                },
                error: function (data) {}			
            });
        }
    }
});
           
app.add(
{
    name: 'explorer-skills-search-process',
    code: function ()
    {
        var search = app.get({scope: 'explorer-skills', valueDefault: {}});
        console.log(search);

        var skillsSet = app.get({scope: 'explorer-skills', context: 'skills-set'});

        if (search.source != undefined && search.source != '-1')
        {
            skillsSet = _.filter(skillsSet, function (skill)
            {
                return (skill.source == search.source)
            })
        }

        if (search.level != undefined && search.level != '-1')
        {
            skillsSet = _.filter(skillsSet, function (skill)
            {
                return (skill.level == search.level)
            })
        }

        if (search.capacity == undefined) {search.capacity = 'C'}

        if (search.capacity != undefined && search.capacity != '-1')
        {
            skillsSet = _.filter(skillsSet, function (skill)
            {
                return (skill.capacity == search.capacity)
            });
        }

        if (!_.isEmpty(search._domain))
        {
            skillsSet = _.filter(skillsSet, function (skill)
            {
                return _.includes(search._domain, skill.domain)
            });
        } 

        if (search['search-text'] != '' && search['search-text'] != undefined)
        {
            var searchText = search['search-text'].toLowerCase();

            skillsSet = _.filter(skillsSet, function (skill)
            {
                return  (_.includes(skill.code.toLowerCase(), searchText)
                            || _.includes(skill.sdi.toLowerCase(), searchText)
                            || _.includes(skill.name.toLowerCase(), searchText)
                            || _.includes(skill.notes.toLowerCase(), searchText)
                            || _.includes(skill.uri.toLowerCase(), searchText)
                        )
            });
        } 

        var skillsView = app.vq.init({queue: 'skills-view'});

        app.set({scope: 'explorer-skills', context: 'skills-set-searched', value: skillsSet});

        if (skillsSet.length == 0)
        {
            skillsView.add('<h3 class="text-muted text-center mt-6">There are no skills that match this search.</h3>');
        }
        else
        {
            var skillsCountText = 'There are ' + skillsSet.length + ' skills that match this search.';
            if (skillsSet.length == 1)
            {
                skillsCountText = 'There is one skill that matches this search.';
            }

            skillsView.add(
            [
                '<div class="row mx-auto" style="width:90%;">',
                    '<div class="col-10 text-dark"><h3 class="mt-2">', skillsCountText, '</h3></div>',
                    '<div class="col-2 text-center">',
                        '<button class="btn btn-sm btn-primary-outline shadow lift entityos-click" data-controller="explorer-skills-export">',
                            '<i class="fe fe-download-cloud text-dark"></i>',
                        '</button>',
                    '</div>',
                '</div>'
            ]);

            skillsView.add(['<div class="card mt-2"><div class="card-body pt-0">']);

            skillsSet = _.sortBy(skillsSet, 'name');

            var skillsLevels = app.get({scope: 'explorer-skills', context: 'skills-levels'});
            var limitReached = false;

            _.each(skillsSet, function (skill, s)
            {
                if (s > 149)
                {
                    if (!limitReached)
                    {
                        limitReached = true;
                        skillsView.add(
                        [
                            '<div class="text-center">',
                                '<h3 class="text-muted mt-6 mb-4">First 150 of ', skillsSet.length, ' skills shown.</h3>',
                                '<button class="btn btn-sm btn-primary-outline shadow lift entityos-click" data-controller="explorer-skills-export">',
                                    'Download All <i class="fe fe-download-cloud"></i>',
                                '</button>',
                            '</div>'
                        ]);
                    }
                }
                else
                {
                    skill._name = skill.name; //_.first(_.split(skill.name, ' ['));
                    skill._onchainassetname = _.replaceAll(skill.sdi, '-', '');

                    var _level = _.find(skillsLevels, function (skillLevel)
                    {
                        return skillLevel.name == skill.level
                    });

                    skill._level = _.replace(skill.level, 'Level ', '');
                    skill._levelNotesUsage = '';

                    var levelHTML = '<div>' + _.replace(skill.level, 'Level ', '') + '</div>';

                    if (_level != undefined)
                    {
                        if (_.first(_level.notes.usage) != '')
                        {
                            skill._levelNotesUsage = _.first(_level.notes.usage);
                            levelHTML = '<div>' + _.replace(levelHTML, 'Level ', '') + '</div><div class="text-muted" style="font-size:0.75rem;">e.g.' + _.first(_level.notes.usage) + '</div>';
                        }
                    }

                    skillsView.add(
                    [
                        '<div class="row pt-5 pb-3 border-bottom border-gray-300">',
                            '<div class="col-12 col-md-9 mb-2"><h2 class="text-dark fw-bold" style="font-size: 1.8rem;">', skill._name, '</h2></div>',
                            '<div class="col-12 col-md-3 mb-2"><h3 class="text-muted" style="text-align: right;">', skill.code, '</h3></div>',
                            '<div class="col-12 col-md-4 mb-2"><div class="text-muted small">Source</div><div>', skill.source, '</div></div>',
                            '<div class="col-12 col-md-3 mb-2"><div class="text-muted small">Domain</div><div>', skill.domain, '</div></div>',
                            '<div class="col-12 col-md-3 mb-2"><div class="text-muted small">Level</div><div>', levelHTML, '</div></div>',
                            '<div class="col-12 col-md-2 mb-2"><div class="text-muted small">Capacity</div><div>', skill.capacity, '</div></div>',
                            '<div class="col-12 col-md-4 mb-2"><div class="text-muted small">URI</div><div>', skill.uri, '</div></div>',
                            '<div class="col-12 col-md-8 mb-2"><div class="text-muted small">SDI</div><div>', skill.sdi, '</div></div>'
                    
                    ]);

                    if (skill.notes != '')
                    {
                        skillsView.add(['<div class="col-12 mb-2"><div class="text-muted small">Notes</div><div>', skill.notes, '</div></div>'])
                    }

                    skillsView.add('</div>')
                }
            });

            skillsView.add(['</div></div>']);
        }

        skillsView.render('#explorer-skills-search-view');
       
    }
});
