# Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/

# Amber (AI-1329 FR-16): the desktop view is the default. Everyone who opens the old interface is
# sent to the matching desktop page, except:
#   - phones, which keep Zammad's mobile app (the mobile_detection plugin sends them to /mobile),
#   - Admins on the old admin pages, until Amber's own admin pages exist.
# A signed-out deep link goes to the desktop login, which returns to the page after sign-in.
class App.AmberDesktopDefault extends App.Controller
  @ADMIN_HASHES: /^#(manage|system|channels|settings|maintenance)\b/

  constructor: ->
    super
    @check()

    $(window).on('hashchange.amber-desktop-default', @check)

  release: ->
    $(window).off('hashchange.amber-desktop-default')

  check: =>
    # Navigate once: the legacy router rewrites the hash (e.g. to #login) while we are leaving,
    # which would otherwise replace the deep link the user asked for.
    return if @navigating
    return if App.MobileDetection.isMobile() and not App.MobileDetection.isForcingDesktopView()
    return if App.User.current()?.permission('admin') and @constructor.ADMIN_HASHES.test(window.location.hash)

    @navigate()

  navigate: ->
    @navigating = true
    hash = window.location.hash.slice(1)
    hash = '' if hash in ['/', 'login', 'logout']

    if hash and not App.Session.get('id')
      window.location.href = "/desktop/login?redirect=#{encodeURIComponent("/#{hash}")}"
      return

    # Same target as App.DesktopBetaSwitch.navigateToDesktop, built from the cleaned hash. With no
    # hash, open the ticket list explicitly: in dev/test builds the desktop root is Zammad's
    # dashboard placeholder (in production it is the ticket list).
    window.location.href = if hash then "/desktop/##{hash}" else '/desktop/tickets/view'

App.Config.set('amber_desktop_default', App.AmberDesktopDefault, 'Plugins')
