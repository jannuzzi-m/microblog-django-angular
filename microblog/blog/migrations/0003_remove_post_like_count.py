# Generated by Django 3.2.4 on 2021-06-10 19:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0002_post_like_count'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='like_count',
        ),
    ]
