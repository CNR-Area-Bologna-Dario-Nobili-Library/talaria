<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>      
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px; 
            line-height: 1.5;
            margin: 0;
            padding: 0;
            background-color: white;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .card {
            background: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .buttonBlock {
            text-align: center; 
            margin: 30px 0;
        }

        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #20a8d8;
            color: white;
            text-decoration: none;
            border-radius: 5px;            
        }

        a {
            color: #013A63;                                
        }

        a:hover {
           text-decoration: underline;         
        }

        .logo {
            text-align: center; margin-bottom: 30px;
        }

        .logo img {
            max-width: 200px;
        }

        .header {
            color: #013A63;
            font-size: 20px; 
            margin-bottom: 20px;
            padding:5px;
        }

        .contacts {
            color: #3b3d40;             
            margin: 30px 0;
        }

        .text-muted {
            color:gray;
            font-style: italic;
        }

        .footer {
            margin-top: 30px; 
            padding-top: 20px; 
            border-top: 1px solid #808080; 
            text-align: center; color: #808080;
        }
        
        .library_data,
        .request_data,
        .reference_data 
        {
            padding:5px;
            background-color: #013A63;
            color: white; 
        }
        
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            {{-- Logo --}}
            <div class="logo">
                <img src="{{ asset('images/logo.png') }}" alt="{{ config('app.name') }}">
            </div>

            {{-- Header --}}
            <h1 class="header">{{$notification_title}}</h1>

            {{-- Content --}}
            @yield('content')

            {{-- Contacts --}}
            <p class="contacts">@lang('notification.contacts')</p>

            {{-- Footer --}}
            <div class="footer">
                @lang('notification.donotreply')
            </div>
        </div>
    </div>
</body>
</html>