from rest_framework import permissions


class IsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    custom_safe_methods = ['DELETE', 'PUT']
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS or request.method in self.custom_safe_methods and obj.owner == request.user:
            return True

        # Write permissions are only allowed to the owner of the snippet.
        # return obj.owner == request.user