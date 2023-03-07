from django.contrib import admin

#for configuration of category admin

class CategoryAdmin(admin.ModelAdmin):
    list_display = ['image_tag','title','url','add_date']
    list_filter = ['add_date']
    search_fields = ['title','url']
    prepopulated_fields = {'url':('title',)}


#for configuration of post admin

class PostAdmin(admin.ModelAdmin):
    list_display = ['title','url','cat']
    list_filter = ['cat','title']
    search_fields = ['title','url']
    prepopulated_fields = {'url':('title',)}

    class Media:
        js = ('https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js','js/script.js',)


# Register your models here.

from .models import Category,Post

admin.site.register(Category,CategoryAdmin)
admin.site.register(Post,PostAdmin)

