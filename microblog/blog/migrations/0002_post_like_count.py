# Generated by Django 3.2.4 on 2021-06-10 19:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='like_count',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
